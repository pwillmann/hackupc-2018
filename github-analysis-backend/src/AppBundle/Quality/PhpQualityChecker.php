<?php

namespace AppBundle\Quality;

use Symfony\Component\Process\ProcessBuilder;

class PhpQualityChecker
{
    /**
     * @var string
     */
    private $rootDir;

    /**
     * PhpQualityChecker constructor.
     */
    public function __construct($rootDir)
    {
        $this->rootDir = $rootDir;
    }

    public function check($dir)
    {
        $builder = new ProcessBuilder();
        $builder->setPrefix('php');

        $process = $builder
            ->setArguments(["{$this->rootDir}/phpmetrics.phar", "$this->rootDir/$dir"])
            ->getProcess();

        $process->setTimeout(180);
        $process->run();

        preg_match_all('#\s+(.*)\s+([\d\.]+)\n#i', $process->getOutput(), $result, PREG_SET_ORDER);

        $results = [];

        foreach ($result as $item) {
            $results[trim($item[1])] = floatval(trim($item[2]));
        }

        return $results;
    }
}