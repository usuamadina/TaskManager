(function() {
    //incrementa content la altura, tanto como el tamañod el footer, para asegurarnos
    // pie de página no tapará el contenido, (lo entiendo regular)
    $('.content')
        .height($('.content').height() + $('.footer').height());
    //oculta barra de herramientas en dispositivos móviles
    window.scrollTo(0, 1);
})();


