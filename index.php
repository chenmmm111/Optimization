<script src="js/jquery-3.2.1.min.js" type = "text/javascript"></script>
<script src="js/canvasjs.min.js" type = "text/javascript"></script>
<html>
<head>
<meta charset="UTF-8">
<title>Optimization Tool</title>
<link rel = "stylesheet"
   type = "text/css"
   href = "css/style.css" />
</head>

<body>
 <a href="/"><img src="icon/PublicisGreaterChina_308x57.png" alt="Publicis Greater China Logo" /></a>
<h1>Media Mix Optimization</h1>

<div id="container">
	<form action="#" method="GET" id = "myForm">
	<p><table class="table1" id="myTable" style="width: 100%"></table></p>
	<button type="button" id="generate" class="btn">GENERATE</button>
	<button type="button" id="optimize" class="btn" disabled="disabled">OPTIMIZE</button>
	
	</form>
</div>
<br>
<br>
<div style="width: 100%">
	<table id="displayTable" style="width:100%">
	<thead>
		<tr>
			<th id="ori-text" style="width:17%" align="center"></th>
			<th id="s1-text" style="width:17%" align="center"></th>
			<th id="s2-text" style="width:17%" align="center"></th>
			<th id="s3-text" style="width:17%" align="center"></th>
			<th id="op-text" style="width:17%" align="center"></th>
			<th id="bud-text" style="width:17%" align="center"></th>
		</tr>
	</thead>
	<tbody>
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
	</tbody>		
	</table>
</div>

<script src="js/calculation.js"></script>
</body>
</html>