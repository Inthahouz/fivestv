<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function index()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/news", name="news")
     */
    public function news()
    {
        return $this->render('default/news.html.twig');
    }

    /**
     * @Route("/qui-sommes-nous", name="qui-sommes-nous")
     */
    public function qsn()
    {
        return $this->render('default/qui-sommes-nous.html.twig');
    }

    /**
     * @Route("/devenir-membre", name="membres")
     */
    public function membres()
    {
        return $this->render('default/devenir-membre.html.twig');
    }

    /**
     * @Route("/notre-histoire", name="histoire")
     */
    public function histoire()
    {
        return $this->render('default/notre-histoire.html.twig');
    }

    /**
     * @Route("/nos-serveurs", name="serveurs")
     */
    public function serveurs()
    {
        return $this->render('default/nos-serveurs.html.twig');
    }
    /**
     * @Route("/nos-communautes", name="communautes")
     */
    public function communautes()
    {
        return $this->render('default/nos-communautes.html.twig');
    }
}
