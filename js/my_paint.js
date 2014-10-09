$(document).ready(function() {
	// Init vars
	var canvas  = $('#canvas');
	var context = canvas[0].getContext('2d');
	var X, Y;
	var X_tmp, Y_tmp;
	var tools  = "pencil";
	var filling = false;
	var color   = "#000000";
	var width   = 5;
	var paint   = false;
	var start   = false;
    var canvasHeight = $('.height').val();
    var canvasWidth = $('.width').val();

    // Size canvas default
    canvas.attr('height', canvasHeight);
    canvas.attr('width', canvasWidth);

    // Open modal
    $('#newDocument').modal({"show":true});

    $('#newDocument form input').bind('keyup', function() {
        canvasHeight = $('.height').val();
        canvasWidth = $('.width').val();
        canvas.attr('height', canvasHeight);
        canvas.attr('width', canvasWidth);
    });

	// Get tool on click in nav tools
	$('.tools .tool').click(function(e) {
        e.preventDefault();

        $('.tools ul li').removeClass('active');
        $(this).parent().addClass('active');

		tools = $(this).attr('data-btn');
		start = false;

        if(tools == "clear") {
            clear();
        }
        else if(tools == "save") {
            save();
        }
	});

	$('#largeur').click(function() {
		width = $('#largeur').attr('value');
	});
	$('#largeur').keyup(function() {
		width = $('#largeur').attr('value');
	});

	$('#filling').click(function() {
		var checkbox = $('#filling').attr('checked');
		if(checkbox == "checked")
			filling = true;
		else
			filling = false;
	});

	//ACTION EFFECTUER SUR LE CANVAS VIA LA SOURIS
	canvas.mousedown(function(e) {
		paint = true;
		X = (e.pageX - this.offsetLeft);
		Y = (e.pageY - this.offsetTop);

		color = $('.simplecolorpicker').attr('title');

		if(tools == "rectangle") {
			context.lineCap = "miter";
			context.lineJoin = "miter";
		}
		else {
			context.lineCap = "round";
			context.lineJoin = "round";
		}

		if(tools == "pencil")
			point();
		else if(tools == "eraser")
			point();
		else if(tools == "rectangle")
			rectangle();
		else if(tools == "trait")
			trait();
		else if(tools == "circle")
			circle();
	});

	$(this).mouseup(function() {
		paint = false;
	});

	canvas.mousemove(function(e) {
		if(paint == true) {
			X = (e.pageX - this.offsetLeft);
			Y = (e.pageY - this.offsetTop);

			if(tools == "pencil")
				pencil();
			else if(tools == "eraser")
				eraser();
		}
	});

	//FONCTIONS QUI GENERE LES FORMES
	function trait() {
		if (start == false) {
			context.beginPath();
			context.moveTo(X, Y);
			start = true;
		}
		else {
			context.lineTo(X, Y);
			context.strokeStyle = color;
			context.lineWidth = width;
			context.stroke();
			context.closePath();
			start = false;
		}
	}

	function rectangle() {
		if(start == false) {
			context.beginPath();
			X_tmp = X;
			Y_tmp = Y;
			start = true;
		}
		else {
			context.rect(X_tmp, Y_tmp, X - X_tmp, Y - Y_tmp);
			if(filling == true) {
				context.fillStyle = color;
	  			context.fill();
	  		}
			context.strokeStyle = color;
			context.lineWidth = width;
			context.stroke();
			context.closePath();
			start = false;
		}
	}

	function circle() {
		if(start == false) {
			context.beginPath();
			X_tmp = X;
			Y_tmp = Y;
			start = true;
		}
		else {
			var rayon = Math.sqrt( ((X - X_tmp)*(X - X_tmp)) + ((Y - Y_tmp)*(Y - Y_tmp)) );
			context.arc(X_tmp, Y_tmp, rayon, 0, 2 * Math.PI);
			if(filling == true) {
				context.fillStyle = color;
	  			context.fill();
	  		}
			context.strokeStyle = color;
			context.lineWidth = width;
			context.stroke();
			context.closePath();
			start = false;
		}
	}

	function point() {
		context.beginPath();
		context.strokeRect(X, Y, 1, 1);
		context.strokeStyle = color;
		context.lineWidth = width;
		context.stroke();
		context.closePath();
	}

	function pencil() {
		if (start == false) {
			context.closePath();
			context.beginPath();
			context.moveTo(X, Y);
			start = true;
		}
		else {
			context.lineTo(X, Y);
			context.strokeStyle = color;
			context.lineWidth = width;
			context.stroke();
		}
	}

	function eraser() {
		if (start == false) {
			context.closePath();
			context.beginPath();
			context.moveTo(X, Y);
			start = true;
		}
		else {
			context.lineTo(X, Y);
			context.strokeStyle = "#FFFFFF";
			context.lineWidth = width;
			context.stroke();
		}
	}

	function clear() {
		context.clearRect(0, 0, canvas.width(), canvas.height());
        setTimeout(function() {
            $('.tools ul li').removeClass('active');
            $('[data-btn="pencil"]').parent().addClass('active');
            tools = "pencil";
        }, 500);
	}

	function save() {
		window.location = canvas[0].toDataURL("image/png");
	}
});