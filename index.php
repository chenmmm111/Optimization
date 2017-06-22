<script src="js/jquery-3.2.1.min.js" type = "text/javascript"></script>
<script src="js/canvasjs.min.js" type = "text/javascript"></script>
<html>
<head>
<meta charset="UTF-8">
<title>Optimization Tool</title>
</head>

<body>
<h1>Publicis Media</h1>
<h2>Media Mix Optimization</h2>
<hr>
<div id="container">
	<form action="#" method="GET" id = "myForm">
	<p><table id="myTable"></table></p>
	<button type="button" id="generate">GENERATE</button>
	<button type="button" id="optimize">OPTIMIZE</button>
	</form>
</div>

<div>
	<table id="displayTable">
		<tr>
			<td id="ori-text"></td>
			<td id="s1-text"></td>
			<td id="s2-text"></td>
			<td id="s3-text"></td>
			<td id="op-text"></td>
			<td id="bud-text"></td>
		</tr>
		<tr>
			<td id="ori-sign"></td>
			<td id="s1-sign"></td>
			<td id="s2-sign"></td>
			<td id="s3-sign"></td>
			<td id="op-sign"></td>
			<td id="bud-sign"></td>
		</tr>
		<tr>
			<td id="ori-sale"></td>
			<td id="s1-sale"></td>
			<td id="s2-sale"></td>
			<td id="s3-sale"></td>
			<td id="op-sale"></td>
			<td id="bud-sale"></td>
		</tr>
		<tr>
			<td><div id="ori-graph" style="height: 400px; width: 100%;"></div></td>
			<td><div id="s1-graph" style="height: 400px; width: 100%;"></div></td>
			<td><div id="s2-graph" style="height: 400px; width: 100%;"></div></td>
			<td><div id="s3-graph" style="height: 400px; width: 100%;"></div></td>
			<td><div id="op-graph" style="height: 400px; width: 100%;"></div></td>
			<td><div id="bud-graph" style="height: 400px; width: 100%;"></div></td>
		</tr>		
	</table>
</div>
<hr>
<script src="js/cal.js"></script>
</body>
</html>