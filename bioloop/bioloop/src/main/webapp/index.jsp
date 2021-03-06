<html>

<head>
<link rel='stylesheet' href='webjars/bootstrap/3.3.5/css/bootstrap.min.css'>
<link rel="stylesheet" href="webjars/font-awesome/4.4.0/css/font-awesome.min.css">
<link rel="stylesheet" href="static/stylesheets/bioloop.css">

<!-- Load libraries: -->
<script type="text/javascript" src='webjars/jquery/1.11.1/jquery.min.js'></script>
<script type="text/javascript" src='webjars/bootstrap/3.3.5/js/bootstrap.min.js'></script>

<script type="text/javascript" src='webjars/flot/0.8.3/jquery.flot.min.js'></script>
<script type="text/javascript" src='webjars/flot/0.8.3/jquery.flot.resize.min.js'></script>
<script type="text/javascript" src='webjars/flot/0.8.3/jquery.flot.time.min.js'></script>

<script type="text/javascript" src='static/javascript/bioloop.js'></script>
<script type="text/javascript" src='static/javascript/diagram_controller.js'></script>
</head>


<body>

	<div class="navbar navbar-static-top navbar-default navbar_first_level" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="/">Bioloop</a>
			</div>

			<div class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li><a href="#" id="menu_measure"><i class="fa fa-bar-chart"></i> Measure</a></li>
					<li><a href="#" id="menu_configure"><i class="fa fa-gear"></i> Configure</a></li>
				</ul>

				<!-- 
					<ul class="nav navbar-nav navbar-right">
						<li><a href="/shutdown"><i class="fa fa-sign-in"></i> Shutdown</a></li>
					</ul>
					-->

			</div>
			<!--/.nav-collapse -->
		</div>
	</div>

	<!-- The header for the submenu of the measure section -->
	<div id="measure_subheader" class="navbar navbar-default">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
				<span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="/"><i class="fa fa-heartbeat"></i> <span id="pulse_display">0</span> Hz</a>
		</div>

		<div class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
				<li><a href="#" id="menu_start"><i class="fa fa-play"></i> Start</a></li>
				<li><a href="#" id="menu_stop"><i class="fa fa-stop"></i> Stop</a></li>
				<li><button type="button" class="btn btn-default navbar-btn" id="button_add_marker">
						<i class="fa fa-flag"></i> Set Marker
					</button></li>
			</ul>
		</div>
		<!--/.nav-collapse -->
	</div>


	<div id="measure_div" class="container-fluid">

		<div class="row">
			<div class="col-sm-12">
				<div class="diagram_container">
					<div id="diagram_1" class="diagram" style="width: 100%; height: 100%;"></div>
				</div>
			</div>
		</div>
		<!-- end .row -->

		<div class="vertical_spacer"></div>

		<div class="row">
			<div class="col-sm-12">
				<div class="diagram_container">
					<div id="diagram_2" class="diagram" style="width: 100%; height: 100%;"></div>
				</div>
			</div>
		</div>

	</div>


	<div id="configure_div" class="container-fluid" hidden>
		<div class="row">
			<div class="col-sm-12 col-md-8 col-md-offset-2">
				<div class="page-header">
					<h3>Time Axis Configuration</h3>
				</div>
			</div>
		</div>
		<!-- end .row -->

		<div class="row">
			<div class="col-sm-12 col-md-4 col-md-offset-2">
				<label class="radio-inline"> <input type="radio" name="optionsRadios" id="optionsTimeRangeMinimum" value="option1" checked> Minimum Range
				</label> <label class="radio-inline"> <input type="radio" name="optionsRadios" id="optionsTimeRangeMedium" value="option2"> Medium Range
				</label> <label class="radio-inline"> <input type="radio" name="optionsRadios" id="optionsTimeRangeMaximum" value="option3"> Maximum Range
				</label>
			</div>
		</div>
		<!-- end .row -->
	</div>


</body>
</html>
