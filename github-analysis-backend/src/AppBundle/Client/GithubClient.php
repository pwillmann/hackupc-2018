<?php

namespace AppBundle\Client;

use GuzzleHttp\ClientInterface;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Process\ProcessBuilder;

/**
 * Class GithubClient
 *
 * @package AppBundle\Client
 */
class GithubClient
{
    /**
     * @var ClientInterface
     */
    private $client;

    /**
     * @var CacheItemPoolInterface
     */
    private $cachePool;

    /**
     * @var string
     */
    private $token;

    /**
     * @var string
     */
    private $projectDir;

    /**
     * GithubClient constructor.
     * @param ClientInterface $client
     * @param CacheItemPoolInterface $cacheItem
     * @param string $token
     * @param $projectDir
     */
    public function __construct(ClientInterface $client, CacheItemPoolInterface $cacheItem, $token, $projectDir)
    {
        $this->client = $client;
        $this->cachePool = $cacheItem;
        $this->token = $token;
        $this->projectDir = $projectDir;
    }

    /**
     * @param string $url
     * @return array
     */
    public function get($url)
    {
        $cache = $this->cachePool->getItem(md5($url . $this->token));

        if ($cache->isHit()) {
            return $cache->get();
        }

        try {
            $content = json_decode($this->client->request('GET', $url, [
                'headers' => [
                    'Authorization' => 'Token ' . $this->token,
                ]
            ])->getBody(), true);
        } catch (\Exception $e) {
            $content = [];
        }

        $this->cachePool->save($cache->set($content)->expiresAfter(360000));

        return $content;
    }

    /**
     * @param string $url
     * @return string
     */
    public function download($username, $url)
    {
        $hash = md5($url . $this->token);

        $file = $this->projectDir . "/var/repos/$username/$hash.tar.gz";

        (new Filesystem())->mkdir(dirname($file));

        if (is_file($file)) {
            $this->extract($file, $hash);
            return $file;
        }

        try {
            $this->client->request('GET', $url, [
                'sink' => $file,
                'headers' => [
                    'Authorization' => 'Token ' . $this->token,
                ]
            ]);
        } catch (\Exception $e) {
            // error no retry
            file_put_contents($file, $e->getMessage());
            return null;
        }

        $this->extract($file, $hash);

        return $file;
    }

    /**
     * @param $file
     * @param $hash
     */
    private function extract($file, $hash)
    {
        $builder = new ProcessBuilder();
        $builder->setPrefix('tar');

        $dirName = dirname($file) . '/' . $hash;
        if (is_dir($dirName)) {
            return;
        }

        (new Filesystem())->mkdir($dirName);

        $builder->setWorkingDirectory($dirName);

        $process = $builder
            ->setArguments(["-xf", $file, "--wildcards", "--no-anchored", "*.php", "*.js"])
            ->getProcess();

        $process->run();
    }
}