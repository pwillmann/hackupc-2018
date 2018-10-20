<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/github-stats/{username}", name="github-stats")
     */
    public function indexAction(Request $request, $username)
    {
        $pr = $this->filterActivityByType($username, ['PullRequestEvent', 'PullRequestEventCreateEvent', 'PullRequestReviewCommentEvent']);
        $push = $this->filterActivityByType($username, ['PushEvent', 'WatchEvent', 'ForkEvent', 'DeleteEvent', 'CreateEvent', 'IssuesEvent']);
        $comment = $this->filterActivityByType($username, ['IssueCommentEvent', 'IssueCommentEvent', 'PullRequestReviewCommentEvent']);

        $tabs = [
            'pull_request' => $pr,
            'push' => $push,
            'comments' => $comment,
        ];

        $acts = array_filter($tabs, function ($v) {
            return $v >= 5;
        });

        $ceil = 0;
        if ($acts) {
            $ceil = ceil(array_sum($acts) / count($acts));
        }

        sleep(2);

        return JsonResponse::create([
            'activity' => [
                'tabs' => $tabs,
                'value' => $activity = $ceil,
            ],
            'popularity' => [
                'value' => $popularity = $this->getPopularity($username),
                'tabs' => $this->getStars($username),
            ],
            'quality' => [
                'value' => $quality = round(($popularity + $activity) / 2),
                'tabs' => [
                    'languages' => array_keys($this->getLanguages($username)),
                    'notification_by_day' => $this->notificationsPerDay($username),
                ]
            ],
            'rank' => [
                'value' => round(($activity + $popularity + $quality) / 3),
                'tabs' => [

                ]
            ],
        ], 200, [
            'Access-Control-Allow-Origin' => '*',
        ]);
    }

    /**
     * @param $username
     * @return array
     */
    private function getLanguages($username)
    {
        $client = $this->get('app.client.github_client');

        $repositories = $client->get('users/' . $username . '/repos?per_page=150');

        $languages = [];

        foreach ($repositories as $repo) {
            if (!isset($repo['languages_url']) || !isset($repo['fork']) || (int) $repo['fork'] > 0) {
                continue;
            }

            foreach ($client->get($repo['languages_url']) as $language => $lines) {
                if (!isset($languages[$language])) {
                    $languages[$language] = 0;
                }

                $languages[$language] += $lines;
            }
        }

        arsort($languages);

        return $languages;
    }


    /**
     * @param $username
     * @return int
     */
    private function getPopularity($username)
    {
        $client = $this->get('app.client.github_client');

        $events = [];

        foreach (range(1, 4) as $page) {
            $events = array_merge($events, $client->get('/users/' . $username . '/received_events?per_page=150&page=' . $page));
        }

        return $this->getWeeksCalc($events);
    }

    /**
     * @param $username
     * @return int
     */
    private function getStars($username)
    {
        $client = $this->get('app.client.github_client');

        $repositories = $client->get('users/' . $username . '/repos?per_page=150');

        $my = array_values(array_filter($repositories, function(array $repo) {
            return !isset($repo['fork']) || (int) $repo['fork'] <= 0;
        }));

        $result['stars'] = array_sum(array_map(function (array $repo) {
            return isset($repo['stargazers_count']) ? $repo['stargazers_count'] : 0;
        }, $my));

        $user = $client->get('users/' . $username);

        $result['followers'] = isset($user['followers']) ? $user['followers'] : 0;

        return $result;
    }

    /**
     * @param array $events
     * @param string|array $event
     * @return float|int
     */
    private function filterActivityByType($username, $event) {
        $client = $this->get('app.client.github_client');

        $events = [];

        foreach (range(1, 4) as $page) {
            $events = array_merge($events, $client->get('/users/' . $username . '/events?per_page=150&page=' . $page));
        }

        $events = array_values(array_filter($events, function(array $item) use ($event, &$foo) {
            return isset($item['type']) && in_array($item['type'], (array) $event, true);
        }));

        return $this->getWeeksCalc($events);
    }

    /**
     * @param array $events
     * @param string|array $event
     * @return float|int
     */
    private function notificationsPerDay($username) {
        $client = $this->get('app.client.github_client');

        $events = [];

        foreach (range(1, 4) as $page) {
            $events = array_merge($events, $client->get('/users/' . $username . '/received_events?per_page=150&page=' . $page));
        }
        $days = [];

        foreach ($events as $event) {
            if (!isset($event['created_at'])) {
                continue;
            }

            $date = new \DateTime($event['created_at']);

            $day = $date->format('y-z');

            if (!isset($days[$day])) {
                $days[$day] = 0;
            }

            $days[$day]++;
        }

        if (count($days) === 0) {
            return 0;
        }

        return round(array_sum($days) / count($days));
    }


    /**
     * @param $event
     * @param $events
     * @return float|int
     */
    private function getWeeksCalc(array $events)
    {
        $weeks = [];

        foreach ($events as $event) {
            if (!isset($event['created_at'])) {
                continue;
            }

            $date = new \DateTime($event['created_at']);

            $week = $date->format('y-W');

            if (!isset($weeks[$week])) {
                $weeks[$week] = 0;
            }

            $weeks[$week]++;
        }

        if (count($weeks) === 0) {
            return 0;
        }

        $averagePushesPerWeek = array_sum($weeks) / count($weeks);

        return round(($averagePushesPerWeek / max($weeks)) * 10);
    }
}
