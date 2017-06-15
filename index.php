<?php 
	
	$count = count($_GET);
	$para=[];
	$inviCon='';
	$mixR='';

	if($count > 0) {
    foreach($_GET as $key => $value) {
		if($key == "invisibleContri"){
			$inviCon = $value;
		}elseif($key == "mixresult"){
			$mixR=$value;
		}else{
			array_push($para, $value);
		}
		
		}
	}
	$paraJS = json_encode($para);


//random part
//
//	$randomcount = count($_POST);
//	$range = $_POST['floatrange'];
//echo $range;
?>
<html>
<head>
<meta charset="UTF-8">
<title>Publicis Media</title>
<script src="js/xlsx.full.min.js"></script>
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
</head>

<body>
<h1>Publicis Media</h1>
<h2>Media Mix Optimization</h2>
<hr>
<script>
	/* set up XMLHttpRequest */
var url = "upload.xlsx";
var oReq = new XMLHttpRequest();
var c = "<?php echo $count;?>";
var randomc="<?php echo $range;?>";


oReq.open("GET", url, true);
oReq.responseType = "arraybuffer";

oReq.onload = function(e) {
  	var arraybuffer = oReq.response;
  	/* convert data to binary string */
  	var data = new Uint8Array(arraybuffer);
  	var arr = new Array();
  	for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  	var bstr = arr.join("");
	var invisible = '';
	var comparemix ='';

  	/* Call XLSX */
  	var workbook = XLSX.read(bstr, {type:"binary"});

  	/* DO SOMETHING WITH workbook HERE */
  	var first_sheet_name = workbook.SheetNames[0];
	
	var first_sheet_name = 'data';
	var second_sheet_name = 'conversion';
	var third_sheet_name = 'coefficient';
	var forth_sheet_name = 'power';
	
  	/* Get worksheet */
	
	
	// get four sheets
  	var worksheet1 = workbook.Sheets[first_sheet_name];
	var worksheet2 = workbook.Sheets[second_sheet_name];
	var worksheet3 = workbook.Sheets[third_sheet_name];
	var worksheet4 = workbook.Sheets[forth_sheet_name];
	
	
	// get four json result
  	var data_json_result = XLSX.utils.sheet_to_json(worksheet1,{raw:true, header:1});
	var conversion_json_result = XLSX.utils.sheet_to_json(worksheet2,{raw:true});
	var coefficient_json_result = XLSX.utils.sheet_to_json(worksheet3,{raw:true});
	var power_json_result = XLSX.utils.sheet_to_json(worksheet4,{raw:true});
	
	// get field variable name array
	var variable_arr = [];
	var contribution = [];
	var head_row = data_json_result[0];
	var temp_data_json = [];
	for(var i = 3; i<Object.keys(head_row).length; i++){
		variable_arr.push(head_row[i]);
		contribution.push(0);
	}
	
	
	if(c>0){
	var paras = <?php echo $paraJS;?>;
	var inviC = "<?php echo $inviCon;?>";
		invisible=inviC;
	var old_contri_array = inviC.split("x");
		var sum = parseFloat(0);
		
		
		for(var i = 0; i < paras.length;i++){
			if(!paras[i]){
				paras[i] = 0;
			}
			if(!old_contri_array){
				old_contri_array[i]=0;
			}
			paras[i] = parseFloat(paras[i]);
			old_contri_array[i] = parseFloat(old_contri_array[i]);
			sum += paras[i];
		}
			
		if(sum != 100){
			alert("The sum of percentages is not 100. Please check check and retype them.");
		}else{
			for(var i=1; i<data_json_result.length;i++){
				for(var j=0; j<contribution.length;j++){
					data_json_result[i][j+3] = paras[j]*data_json_result[i][j+3]/old_contri_array[j];
				}
			}
		}
		
	}
	
	if(randomc > 0){
		for(old_contri_array)
	}
	
	
	// calculation - get mix result
	// i is row number, j is column number
	var mix_result = 0;
	var ori_mix = "";
	var contribution_sum = 0;
	for(var i = 1; i<data_json_result.length; i++){
		var row_sum = 0;
		var baseline = data_json_result[i][1];
		for(var j = 0; j<variable_arr.length; j++){
			var data = data_json_result[i][j+3];
			var conversion = conversion_json_result[0][variable_arr[j]];
		
			var coefficient = coefficient_json_result[0][variable_arr[j]];
			var power = power_json_result[0][variable_arr[j]];
			var td = coefficient*Math.pow(data,power);
			
			
			contribution[j] += conversion*data;
			row_sum += td;
			if(i == data_json_result.length - 1){
				contribution_sum += contribution[j];
			}
		}
		
		row_sum += baseline;
		
		mix_result += row_sum;
	}
	
	
	// get contribution percentage
	var contribution_fix= [];
	
	for(var i = 0; i<contribution.length;i++){
		contribution[i] = contribution[i]*100/contribution_sum;
		contribution_fix.push(Number(Math.round(contribution[i] + 'e1') + 'e-1'));
	}
	
	
	
	// write table in the web
	var output = document.getElementById('output');

	if(c>0){
		ori_mix="<?php echo $mixR;?>";
		ori_mix= parseFloat(ori_mix);
		var change = Number(Math.round((mix_result*100/ori_mix-100) + 'e2') + 'e-2');
		if(change>0){
			comparemix = ' (+'+change+'%)';
		}else{
			comparemix = ' ('+change+'%)';
		}
			
		
		console.log(ori_mix);
				console.log(mix_result);
				console.log(change);
		
	}
	var mix_result_html = '<p>Mix result: '+ Math.round(mix_result)+comparemix +'<p>';
	var table = '';

//	// table finished
	var rows = 3;
	for (var i = 0; i < rows;i++){
		table += '<tr>';
		for(var j = 0; j< variable_arr.length;j++){
			if(i == 0){
				table += '<td>' + variable_arr[j] + '(%)</td>';
			}
			if(i == 1 & c==0){
				table += '<td>' + contribution_fix[j] + '</td>';
//				invisible += '<input type="hidden" name="Contribution'+j+'" id="Contribution'+j+'" value="'+contribution[j]+'"/>';
				invisible += contribution[j]+"x";

			}
			if(i == 2){
				table += '<td><input type = "number" name=' +variable_arr[j]+' id = '+variable_arr[j]+' value=""/></td>'; 
			}
			
		}
		table += '</tr>';
		invisible = invisible.replace(/x$/,"");
		
		// add original contribution
		table += '<input type="hidden" name="invisibleContri" id="invisibleContri" value="'+invisible+'"/>';
		// add changes
		if(c>0){
			table += '<input type="hidden" name="mixresult" id="mixresult" value='+ori_mix+'/>';
		}else{
			table += '<input type="hidden" name="mixresult" id="mixresult" value="'+mix_result+'"/>';
		}
		
	}
	
	var button = '<p><input type="submit" value="SUBMIT"/></p>';
	output.innerHTML = mix_result_html+ '<form action="#" method="GET"><table>' + table + '</table>'  +button + '</form>'; 
}


oReq.send();
</script>


	

<div id="container">
	<p id="output">Nothing yet</p>
</div>
<hr>

<div id="container">

	<form action="#" method="POST">
		<p>Input floating range of contributions:  &#177;<input type="number" name="floatrange" id="floatrange"/>&#37;</p>
		<p><input type="submit" name="floatrangesubmit" id="floatrangesubmit" value="Get Max Rsesult"/></p>
	</form>
</div>


</body>
</html>