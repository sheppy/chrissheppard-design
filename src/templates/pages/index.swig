{% extends "../layouts/main.swig" %}


{% import "../components/_button.swig" as button %}
{% import "../components/_image.swig" as image %}

{% block content %}
    <h1>{{ pageTitle }}</h1>

    {{ button.button("test") }}
    {{ button.button("teste2", "#") }}
    {{ image.figure("https://placeholdit.imgix.net/~text?txtsize=33&txt=Placeholder&w=220&h=189", "test", "test") }}

{% endblock %}
