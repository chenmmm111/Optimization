<script src="js/jquery-3.2.1.min.js" type = "text/javascript"></script>
<script src="js/canvasjs.min.js" type = "text/javascript"></script>
<html>
<head>
<meta charset="UTF-8">
<title>Optimization Tool</title>
<style>
    .canvasjs-chart-credit {
   		display: none;
	}
    </style>
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

<div style="width: 100%">
	<table id="displayTable">
		<tr>
			<td id="ori-text" style="width:17%" align="center"></td>
			<td id="s1-text" style="width:17%" align="center"></td>
			<td id="s2-text" style="width:17%" align="center"></td>
			<td id="s3-text" style="width:17%" align="center"></td>
			<td id="op-text" style="width:17%" align="center"></td>
			<td id="bud-text" style="width:17%" align="center"></td>
		</tr>
		<tr>
			<td id="ori-sign" align="center"></td>
			<td id="s1-sign" align="center"></td>
			<td id="s2-sign" align="center"></td>
			<td id="s3-sign" align="center"></td>
			<td id="op-sign" align="center"></td>
			<td id="bud-sign" align="center"></td>
		</tr>
		<tr>
			<td id="ori-sale" align="center"></td>
			<td id="s1-sale" align="center"></td>
			<td id="s2-sale" align="center"></td>
			<td id="s3-sale" align="center"></td>
			<td id="op-sale" align="center"></td>
			<td id="bud-sale"align="center"></td>
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