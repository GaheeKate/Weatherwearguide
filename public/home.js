window.onload = function () {
    var slides = document.querySelector('.slides');
    var slide = document.querySelectorAll('.slides li');
    var currentIndex = 0;
    var slideCount = slide.length;
    var slideWidth = 300;
    var slideMargin = 30;
    var prevBtn = document.querySelector('#prev');
    var nextBtn = document.querySelector('#next');



    function makeClone() {
        for (var i = 0; i < slideCount; i++) {
            //a.cloneNode(), a.cloneNode(true) = clone a with its child
            var cloneSlide = slide[i].cloneNode(true)
            cloneSlide.classList.add("clone");
            slides.appendChild(cloneSlide)
        };

        for (var i = slideCount - 1; i >= 0; i--) {
            var cloneSlide = slide[i].cloneNode(true)
            cloneSlide.classList.add("clone");
            slides.prepend(cloneSlide)

        }
        updateWidth();
        setInitialPos();
        setTimeout(() => {
            slides.classList.add('animated');
        }, 100)

    };


    function updateWidth() {
        var currentSlide = document.querySelectorAll(".slides li")
        var newSlideCount = currentSlide.length;

        var newWidth = ((slideWidth + slideMargin) * newSlideCount - slideMargin) + 'px';
        slides.style.width = newWidth;
    };

    function setInitialPos() {
        var initialTranslateValue = -(slideWidth + slideMargin) * slideCount
        slides.style.transform = `translateX(${initialTranslateValue}px)`
    };


    function moveSlide(num) {
        slides.style.left = -num * (slideWidth + slideMargin) + 'px';
        currentIndex = num;
        if (currentIndex == slideCount || currentIndex == -slideCount) {
            setTimeout(() => {
                slides.classList.remove('animated');
                slides.style.left = '0px';
                currentIndex = 0;
            }, 100)
            setTimeout(() => {
                slides.classList.add('animated');

            }, 105)



        }

    }

    nextBtn.addEventListener('click', () => {
        moveSlide(currentIndex + 1);
    })
    prevBtn.addEventListener('click', () => {
        moveSlide(currentIndex - 1);

    })

    makeClone();
}


