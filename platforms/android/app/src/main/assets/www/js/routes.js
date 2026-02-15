//INICIALIZAÇÃO DO F7 QUANDO DISPOSITIVO ESTÁ PRONTO
document.addEventListener('deviceready', onDeviceReady, false);
var app = new Framework7({
  // App root element
  el: '#app',
  // App Name
  name: 'School Business',
  // App id
  id: 'com.myapp.schoolbusiness',
  // Enable swipe panel
  panel: {
    swipe: true,
  },
  view: {
   // animate: false,
   //iosSwipeBack: false,
  },
  dialog: {
    buttonOk: 'Sim',
    buttonCancel: 'Cancelar',
  },
  
  // Add default routes
  routes: [
  {
    path: '/subject/warnings',
    url: './pages/warnings.html',
  },
  {
    path: '/profile/',
    url: './profile.html',
  },
  {
    path: '/edit/profileEdit/',
    url: './pages/profileEdit.html',
  },
  {
    path: '/subject/math/',
    url: './pages/math.html',
  },
  {
    path: '/subject/biology/',
    url: './pages/biology.html',
  },
  {
    path: '/subject/chemistry/',
    url: './pages/chemistry.html',
  },
  {
    path: '/subject/art/',
    url: './pages/art.html',
  },
  {
    path: '/subject/english/',
    url: './pages/english.html',
  },
  {
    path: '/subject/physicalEducation/',
    url: './pages/physicalEducation.html',
  },
  {
    path: '/subject/literature/',
    url: './pages/literature.html',
  },
  {
    path: '/subject/philosophy/',
    url: './pages/philosophy.html',
  },
  {
    path: '/subject/sociology/',
    url: './pages/sociology.html',
  },
  {
    path: '/subject/portuguese/',
    url: './pages/portuguese.html',
  },
  {
    path: '/subject/history/',
    url: './pages/history.html',
  },
  {
    path: '/subject/geography/',
    url: './pages/geography.html',
  },
  {
    path: '/subject/writing/',
    url: './pages/writing.html',
  },
  {
    path: '/subject/science/',
    url: './pages/science.html',
  },
  {
    path: '/subject/physics/',
    url: './pages/physics.html',
  },
  {
    path: '/math/topic/geometria/',
    url: './pages/math_geometria.html',
  },
  {
    path: '/topics/math/equacoes2/',
    url: './pages/topics/math/equacoes2.html',
  },
  {
    path: '/topics/math/funcoesAfins/',
    url: './pages/topics/math/funcoesAfins.html',
  },
  {
    path: '/topics/math/geometria/',
    url: './pages/topics/math/geometria.html',
  },
  {
    path: '/topics/portuguese/interpretacao/',
    url: './pages/topics/portuguese/interpretacao.html',
  },
  {
    path: '/topics/portuguese/classesGramaticais/',
    url: './pages/topics/portuguese/classesGramaticais.html',
  },
  {
    path: '/topics/portuguese/figurasLinguagem/',
    url: './pages/topics/portuguese/figurasLinguagem.html',
  },
  {
    path: '/topics/writing/dissertativoArg/',
    url: './pages/topics/writing/dissertativoArg.html',
  },
    {
      path: '/index/',
      url: 'index.html',
      animate: false,
	  on: {
		pageBeforeIn: function (event, page) {
		// fazer algo antes da página ser exibida
		},
		pageAfterIn: function (event, page) {
		// fazer algo depois da página ser exibida
		},
		pageInit: function (event, page) {
		// fazer algo quando a página for inicializada
		},
		pageBeforeRemove: function (event, page) {
		// fazer algo antes da página ser removida do DOM
		},
	  }
    },
     {
      path: '/home/',
      url: 'home.html',
      animate: false,
	  on: {
		pageBeforeIn: function (event, page) {
		// fazer algo antes da página ser exibida
		},
		pageAfterIn: function (event, page) {
		// fazer algo depois da página ser exibida
		},
		pageInit: function (event, page) {
		$.getScript('js/index.js');
     var swiper = new Swiper(".swiperImages", {
      slidesPerView: 1,
      spaceBetween: 30,
      autoplay: true,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
      },
    });
     var swiper = new Swiper(".swiperCategories", {
      slidesPerView: 3,
      spaceBetween: 7,
      breakpoints: {
        50: {
          slidesPerView: 3,
          spaceBetween: 4,
        },
         640: {
          slidesPerView: 6,
          spaceBetween: 4,
        },
        992: {
          slidesPerView: 8,
          spaceBetween: 4,
        },
        1200: {
          slidesPerView: 12,
          spaceBetween: 4,
        },
      }
    });
		},
		pageBeforeRemove: function (event, page) {
		// fazer algo antes da página ser removida do DOM
		},
	  }
    },
    {
      path: '/link2/',
      url: 'link2.html',
      animate: false,
	  on: {
		pageBeforeIn: function (event, page) {
		// fazer algo antes da página ser exibida
		},
		pageAfterIn: function (event, page) {
		// fazer algo depois da página ser exibida
		},
		pageInit: function (event, page) {
		var swiper = new Swiper(".swiperCategoriesMural", {
      slidesPerView: 3,
      spaceBetween: 7,
      breakpoints: {
        50: {
          slidesPerView: 3,
          spaceBetween: 4,
        },
         640: {
          slidesPerView: 6,
          spaceBetween: 4,
        },
        992: {
          slidesPerView: 8,
          spaceBetween: 4,
        },
        1200: {
          slidesPerView: 12,
          spaceBetween: 4,
        },
      }
    });
		},
		pageBeforeRemove: function (event, page) {
		// fazer algo antes da página ser removida do DOM
		},
	  }
    },
    {
      path: '/link3/',
      url: 'link3.html',
      animate: false,
	  on: {
		pageBeforeIn: function (event, page) {
		// fazer algo antes da página ser exibida
		},
		pageAfterIn: function (event, page) {
		// fazer algo depois da página ser exibida
		},
		pageInit: function (event, page) {
		// fazer algo quando a página for inicializada
		},
		pageBeforeRemove: function (event, page) {
		// fazer algo antes da página ser removida do DOM
		},
	  }
    },
    {
      path: '/link4/',
      url: 'link4.html',
      animate: false,
	  on: {
		pageBeforeIn: function (event, page) {
		// fazer algo antes da página ser exibida
		},
		pageAfterIn: function (event, page) {
		// fazer algo depois da página ser exibida
		},
		pageInit: function (event, page) {
		// fazer algo quando a página for inicializada
		},
		pageBeforeRemove: function (event, page) {
		// fazer algo antes da página ser removida do DOM
		},
	  }
    },
  ],
  // ... other parameters
});

//Para testes direto no navegador
var mainView = app.views.create('.view-main', { url: '/index/' });

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.open-pdf');
  if (!btn) return;

  e.preventDefault();

  const rel = btn.dataset.pdf; // "pdfs/equacoes2.pdf"

  // Navegador
  if (!window.cordova) {
    window.open(rel, '_blank');
    return;
  }

  // 1) origem do arquivo dentro do app (empacotado)
  const src = cordova.file.applicationDirectory + 'www/' + rel;

  // 2) Copia pro cache (apps externos conseguem abrir melhor daqui)
  const fileName = rel.split('/').pop(); // "equacoes2.pdf"

  window.resolveLocalFileSystemURL(src, function (fileEntry) {
    window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (cacheDir) {
      fileEntry.copyTo(cacheDir, fileName, function (copiedEntry) {
        // 3) Abre no leitor nativo
        cordova.plugins.fileOpener2.open(
          copiedEntry.nativeURL,
          'application/pdf',
          {
            error: function (err) {
              console.error('Erro ao abrir PDF:', err);
              alert('Não foi possível abrir o PDF no dispositivo.');
            }
          }
        );
      }, function (err) {
        console.error('Erro ao copiar pro cache:', err);
        alert('Erro ao preparar o PDF.');
      });
    });
  }, function (err) {
    console.error('PDF não encontrado dentro do app:', err, src);
    alert('PDF não encontrado. Confirme se está em www/pdfs/');
  });
}, true);

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.open-video');
  if (!btn) return;

  e.preventDefault();

  const ytId = btn.dataset.yt;
  const popupSel = btn.dataset.popup || '#video-popup';

  const iframe = document.querySelector(`${popupSel} iframe`);

  if (iframe && ytId) {
    iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  }

  app.popup.open(popupSel);
}, true);

// Quando o popup fecha, para o vídeo
document.addEventListener('popup:closed', function (e) {
  if (!e.target) return;

  const iframe = e.target.querySelector('iframe');
  if (iframe) {
    iframe.src = '';
  }
});

//EVENTO PARA SABER O ITEM DO MENU ATUAL
app.on('routeChange', function (route) {
  var currentRoute = route.url;
  console.log(currentRoute);
  document.querySelectorAll('.tab-link').forEach(function (el) {
    el.classList.remove('active');
  });
  var targetEl = document.querySelector('.tab-link[href="' + currentRoute + '"]');
  if (targetEl) {
    targetEl.classList.add('active');
  }
});


function onDeviceReady() {
  //Quando estiver rodando no celular
  var mainView = app.views.create('.view-main', { url: '/index/' });

  //COMANDO PARA "OUVIR" O BOTAO VOLTAR NATIVO DO ANDROID 	
  document.addEventListener("backbutton", function (e) {

    if (mainView.router.currentRoute.path === '/index/') {
      e.preventDefault();
      app.dialog.confirm('Deseja sair do aplicativo?', function () {
        navigator.app.exitApp();
      });
    } else {
      e.preventDefault();
      mainView.router.back({ force: true });
    }
  }, false);

}
