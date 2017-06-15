$.getScript("js/xlsx.full.min.js",function(){
	
	// calculation counts\
	var count = 0;
	var type = 'origin';
	
	if(type == "origin"){
		count = 1;
	}else if(type = "adjustment"){
		count = 2;
	}else if(type = "optimize"){
		count = 101;
	}
	
	// get parameters
	var paras = '';
	
	/* set up XMLHttpRequest */
	var url = "data.xlsx";
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";

	oReq.onload = function(e) {
  		var arraybuffer = oReq.response;

  		/* convert data to binary string */
  		var data = new Uint8Array(arraybuffer);
  		var arr = new Array();
		for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  		var bstr = arr.join("");

    	/* Call XLSX */
  		var workbook = XLSX.read(bstr, {type:"binary"});

		/* DO SOMETHING WITH workbook HERE */

		// get four sheets
		var worksheet1 = workbook.Sheets['data'];
		var worksheet2 = workbook.Sheets['conversion'];
		var worksheet3 = workbook.Sheets['coefficient'];
		var worksheet4 = workbook.Sheets['power'];
		var worksheet5 = workbook.Sheets['lag'];
		var worksheet6 = workbook.Sheets['plus'];
		
		// get json results
		var data_json_ori = XLSX.utils.sheet_to_json(worksheet1,{raw:true, header:1});
		var conversion_json_ori = XLSX.utils.sheet_to_json(worksheet2,{raw:true});
		var coefficient_json_ori = XLSX.utils.sheet_to_json(worksheet3,{raw:true});
		var power_json_ori = XLSX.utils.sheet_to_json(worksheet4,{raw:true});
		var lag_json_ori = XLSX.utils.sheet_to_json(worksheet5,{raw:true});
		var plus_json_ori = XLSX.utils.sheet_to_json(worksheet6,{raw:true});
		
		// get field variable name array
		var variable_arr = [];
		var head_row = data_json_ori[0];
		for(var i = 3; i<Object.keys(head_row).length; i++){
			variable_arr.push(head_row[i]);
		}
		
		// calculation
		var result_ori = 0;
		var result_ouput = 0;
		var data_json_cal = [];
		var media_mix_ori = [];
		var contribution_ori = [];
		var contribution_cal = [];
		var sale_ori = 0;
		var sale_cal = 0;
		var baseline = 0;
		
		for(var c = 0; c<count; c++){
			//column
			var mediamixtotal = 0;
			if(c==0){
				data_json_cal = data_json_ori.slice(0);
			}else if(type == "adjustment"){
				for(var i=1; i<data_json_result.length;i++){
					for(var j=0; j<variable_arr.length;j++){
						data_json_cal[i][j+3] = paras[j]*data_json_ori[i][j+3]/contribution_ori[j];
					}
				}
			}else{
				//randomly generate parameters to get media mix
			}
			
			
			for(var i = 0; i<=variable_arr.length; i++){
				var sub_contribution = 0;
				var sub_total = 0;
				for(var j = 1; j<data_json_cal.length;j++){
					if(i == variable_arr.length){
						//calculate baseline
						baseline += data_json_cal[j][1];
					}else{
						var data = data_json_cal[j][i+3];
						var coefficient = coefficient_json_ori[0][variable_arr[i]];
						var power = power_json_ori[0][variable_arr[i]];
						var temp_con = coefficient*Math.pow(data,power);
						sub_contribution += temp_con;
						if(c == 0){
							var conversion = conversion_json_ori[0][variable_arr[i]];
							var temp = conversion * data_json_cal[j][i+3];
							sub_total += temp;
						}
					}
				}
				if(c == 0 && i != variable_arr.length){
					contribution_ori.push(sub_contribution);
					sale_ori += sub_contribution;
					media_mix_ori.push(sub_total);
					mediamixtotal += sub_total;
				}else{
					contribution_cal.push(sub_contribution);
					sale_cal += sub_contribution;
				}
				
			}
			
			// get sales
			if(c == 0){
					sale_ori += baseline;
					for(var k = 0; k < media_mix_ori.length; k++){
						media_mix_ori[k] = Number(Math.round(media_mix_ori[k]*100/mediamixtotal + 'e1') + 'e-1');
					}
				}else{
					sale_cal += baseline;
				}
			
		}
		

		console.log(data_json_ori);
		console.log(data_json_cal);
		console.log(baseline);
		console.log(mediamixtotal);
		console.log(media_mix_ori);
		console.log(sale_ori);
		console.log(contribution_ori);
	}

	oReq.send();
});


