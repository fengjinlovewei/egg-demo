<!-- app/view/news/list.tpl -->
<!DOCTYPE html>
<html>
  <head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" type="text/css" />
  </head>
  <body>
    <ul class="news-view view">
      {% for item in list %}
      <li class="item">
        {{ helper.relativeTime(item.time) }}
        <a href="{{ item.url }}">{{ item.title }}</a>
      </li>
      {% endfor %}
    </ul>
  </body>
</html>
