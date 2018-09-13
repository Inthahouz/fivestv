-Lancer le server => php bin/console server:run (URL donnée dans la console)

-Help => php bin/console

-BDD => fivestv (avec MAMP)

Créer nouvelle page => dans DefautController.php (pour une page news par exemple )
```php
  /**
  * @Route("/news", name="news")
  */
  public function news()
  {
      return $this->render('default/news.html.twig');
  }
```
Path pour les routes : <a href="{{ path('news)}}">News</a>
    
 - Liens pour les assets : 
 
```html
    <img src="{{ asset('images/logo.png') }}" />
```    

- NPM start ----> remplace le gulp

- Montrer le site => /ngrok run build 8000

- NPM run build => pour la mise en prod
