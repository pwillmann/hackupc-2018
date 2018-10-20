<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class QualityController extends Controller
{
    /**
     * @Route("/quality/{username}")
     * @param Request $request
     */
    public function indexAction(Request $request, $username)
    {
        $client = $this->get('app.client.github_client');

        $myRepos = array_values(array_filter($client->get('users/' . $username . '/repos?per_page=150'), function(array $repo) {
            return !isset($repo['default_branch']) || !isset($repo['fork']) || (int) $repo['fork'] <= 0;
        }));

        $urls = array_map(function (array $repo) {
            return str_replace(['{archive_format}', '{/ref}'], ['tarball', ''], $repo['archive_url']);
        }, $myRepos);


        foreach ($urls as $url) {
            $client->download($username, $url);
        }

        $userRepos = 'var/repos/' . $username;

        $js = $this->get('app.quality.js_quality_checker')->check($userRepos);
        $php = $this->get('app.php_quality_checker')->check($userRepos);

        if (!isset($php['Comment lines of code']) || $php['Logical lines of code']) {
            $php['comments'] = round(($php['Comment lines of code'] / $php['Logical lines of code']) * 100, 2);
        }

        if (!isset($php['Classes']) || $php['Interface']) {
            $php['interfaces'] = round(($php['Interface'] / $php['Classes']) * 100, 2);
        }

        if (!isset($php['Classes']) || $php['Interface']) {
            $php['interfaces'] = round(($php['Interface'] / $php['Classes']) * 100, 2);
        }

        if (!isset($php['Classes']) || $php['Interface']) {
            $php['interfaces'] = round(($php['Interface'] / $php['Classes']) * 100, 2);
        }

        $php['methods_per_class'] = $php['Methods by class'];
        $php['loc'] = $php['Lines of code'];

        return JsonResponse::create([
            'php' => $php,
            'js' => $js,
        ], 200, [
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
}