# Backend

## Python

```
sudo apt-get install python3-pip
sudo pip3 install -U spacy
sudo python3 -m spacy download xx
```

## API

```
http://trust-trivago.espend.de/github-stats/haehnchen
```

```
{
   "activity":{
      "value":6,
      "tabs":[

      ]
   },
   "popularity":{
      "value":4,
      "tabs":{
         "stars":1568
      }
   },
   "quality":{
      "value":5,
      "tabs":{
         "languages":[
            "Java",
            "PHP",
            "JavaScript"
         ]
      }
   },
   "rank":{
      "value":5,
      "tabs":[

      ]
   }
}
```

```
http://trust-trivago.espend.de/language-extraction?q=Hello%20World
```

```
{
   "name":"Christopher Probst",
   "place":"Syria",
   "age":"26"
}
```

```
http://trust-trivago.espend.de/sentiment-analysis?q=Mir geht es gut
http://trust-trivago.espend.de/sentiment-analysis?q=Mir geht es schlecht
```

```
{"sentiment":"Positive"}
{"sentiment":"Negative"}
```

```
http://trust-trivago.espend.de/doc-similarity?q=Das Wetter ist gut aber der Schnee schneit vom blauen Himmel
http://trust-trivago.espend.de/doc-similarity?q=Das Essen bei Trivago ist sehr gut
```

```
{"acc":0.3952123486027508,"Level":"B1"}
{"acc":0.21674839277792168, "Level":"A1"}
```