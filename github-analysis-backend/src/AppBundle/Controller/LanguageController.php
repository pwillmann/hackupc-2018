<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Process\ProcessBuilder;

class LanguageController extends Controller
{
    /**
     * @Route("/language-extraction")
     * @param Request $request
     */
    public function indexAction(Request $request)
    {
        return $this->executeScript('name_detection.py', $request->get('q'));
    }

    /**
     * @Route("/doc-similarity")
     * @param Request $request
     */
    public function docSimilarityAction(Request $request)
    {
        return $this->executeScript('doc_similarity.py', $request->get('q'));
    }

    /**
     * @Route("/sentiment-analysis")
     * @param Request $request
     */
    public function sentimentAnalysisAction(Request $request)
    {
        return $this->executeScript('sentiment_analysis.py', $request->get('q'));
    }

    /**
     * @param $script
     * @param $query
     * @return \Symfony\Component\HttpFoundation\Response|static
     * @internal param Request $request
     */
    private function executeScript($script, $query)
    {
        $builder = new ProcessBuilder();
        $builder->setPrefix('python3');

        $dir = $this->getParameter('kernel.project_dir');

        $process = $builder
            ->setArguments([dirname($dir) . '/python/' . $script, $query])
            ->getProcess();

        $process->run();

        $content = trim($process->getOutput());

        if (!$json = json_decode($content, true)) {
            return JsonResponse::create([
                'success' => false,
                'message' => $process->getOutput() . $process->getErrorOutput(),
            ]);
        }

        return JsonResponse::create($json, 200, [
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
}