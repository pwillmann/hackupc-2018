<?php

namespace AppBundle\Quality;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\ProcessBuilder;

class JsQualityChecker
{
    /**
     * @var string
     */
    private $rootDir;

    /**
     * PhpQualityChecker constructor.
     * @param $rootDir
     */
    public function __construct($rootDir)
    {
        $this->rootDir = $rootDir;
    }

    public function check($dir)
    {
        $builder = new ProcessBuilder();
        $builder->setPrefix('jshint');

        $process = $builder
            ->setArguments(["--reporter", "checkstyle", "$this->rootDir/$dir"])
            ->getProcess();


        $process->run();

        try {
            $xml = simplexml_load_string($process->getOutput());
        } catch (\Exception $e) {
            return [];
        }

        if (!$xml) {
            return [];
        }

        $errors = [];

        foreach ($xml->xpath('//error') as $error) {
            $e = json_decode(json_encode($error), true);

            if (!isset($e['@attributes'])) {
                continue;
            }

            $errors[] = $e['@attributes'];
        }

        return $errors;
    }
}