'use strict'

var slider = document.querySelectorAll('.info');
var slides = document.querySelectorAll('.info__block');
var img    = document.querySelectorAll('.features-item__img');

window.onload = function() {
	slides.forEach(function(el) {
		el.classList.remove('info__block--no-js');
	});
	img.forEach(function(el) {
		el.classList.remove('features-item__img--no-js');
	});
	if (window.screen.width < 768) {
		slider.forEach(function(el) {
			el.classList.add('slider');  
		});
		slides.forEach(function(el) {
			el.classList.add('info__slide');
		});
	}
};