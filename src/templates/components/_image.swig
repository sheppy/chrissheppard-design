{% macro figure(src, alt, caption, classes) %}
    <figure class="figure {{ classes|join(' ') }}">
        <img src="{{ src }}" alt="{{ alt }}">
        {% if caption %}
            <figcaption>
                {{ caption|safe }}
            </figcaption>
        {% endif %}
    </figure>
{% endmacro %}
