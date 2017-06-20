<?php 
	$vcount = count($_GET);
	$rowinfo = $_GET["rowinfo"];
	$para=[];
	if($vcount > 0) {
    foreach($_GET as $key => $value) {
		if($key == "rowinfo"){
			$rowinfo = $value;
			}else{
				array_push($para, $value);
			}		
		}
	}
	$paraJS = json_encode($para);
	
?>
<script src="js/jquery-3.2.1.min.js" type = "text/javascript"></script>
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
	<form action="#" method="GET">
	<p><table id="myTable"></table></p>
	<input type="hidden" name="rowinfo" id="rowinfo"/>
	<input type="submit" value="GENERATE"/>
		<button type="submit" id="optimize">OPTIMIZE</button>
	</form>
</div>
<hr>
<!--
<div id="container">
	<form action="#" method="POST">
		<p>Input floating range of contributions:  &#177;<input type="number" name="floatrange" id="floatrange"/>&#37;</p>
		<p><input type="submit" name="floatrangesubmit" id="floatrangesubmit" value="Optimize"/></p>
	</form>
</div>
-->
<script type="text/javascript">
	var vcount = "<?php echo $vcount?>";
	var rowinfo = URLdecode("<?php echo $rowinfo?>");
	var paras = <?php echo $paraJS?>;
	var sum = parseFloat(0);
		
		
		for(var i = 0; i < paras.length;i++){
			if(!paras[i]){
				paras[i] = 0;
			}
			
			paras[i] = parseFloat(paras[i]);
			sum += paras[i];
		}
	
	
	// get table content
	
	function URLdecode(str) {
        var ret = "";
        for(var i=0;i<str.length;i++) {
                var chr = str.charAt(i);
                if(chr == "+") {
                        ret += " ";
                }else if(chr=="%") {
                        var asc = str.substring(i+1,i+3);
                        if(parseInt("0x"+asc)>0x7f) {
                                ret += decodeURI("%"+ str.substring(i+1,i+9));
                                i += 8;
                        }else {
                                ret += String.fromCharCode(parseInt("0x"+asc));
                                i += 2;
                        }
                }else {
                        ret += chr;
                }
        }
        return ret;
}
</script>
<script src="js/calculation1.js"></script>
</body>
</html>