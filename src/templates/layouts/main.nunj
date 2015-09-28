<!doctype html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">

    <title>{{ pageTitle }}</title>

    {% if meta.description %}
        <link rel="description" href="{{ meta.description }}">
    {% endif %}

    {% if meta.author %}
        <link rel="author" href="{{ meta.author }}">
    {% endif %}

    {% if social.googlePlus %}
        <link rel="publisher" href="{{ social.googlePlus }}">
    {% endif %}

    {% if meta.robots %}
        <link rel="author" href="{{ meta.robots }}" type="text/plain">
    {% endif %}

    {% if social.twitter %}
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@{{ social.twitter }}">
        <meta name="twitter:title" content="{{ pageTitle }}">
        <meta name="twitter:description" content="{{ meta.description }}">
    {% endif %}

    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_GB">
    <meta property="og:title" content="{{ pageTitle }}">

    {% if meta.name %}
        <meta property="og:site_name" content="{{ meta.name }}">
    {% endif %}

    {% if meta.description %}
        <meta property="og:description" content="{{ meta.description }}">
    {% endif %}

    {% if meta.url %}
        <meta property="og:url" content="{{ meta.url }}">
    {% endif %}

    {% if meta.image %}
        <meta property="og:image" content="{{ meta.image }}">
    {% endif %}

    <link href="//fonts.googleapis.com/css?family=Crimson+Text" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/main.css">

    <script src="/assets/js/modernizr.js"></script>
</head>
<body>

    <header role="banner">
        <h1><a href="/">Site</a></h1>

        <nav role="navigation">
            <ul>
                <li><a href="/" rel="home">Home</a></li>
            </ul>
        </nav>
    </header>

    <main role="main">
        {% block content %}{% endblock %}
    </main>

    <footer role="contentinfo"></footer>

    <script src="/assets/js/index.js"></script>
</body>
</html>