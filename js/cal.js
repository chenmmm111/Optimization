$.getScript("js/xlsx.full.min.js",function(){
	/* set up XMLHttpRequest */
	var url = "upload.xlsx";
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
		
		// get six sheets
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
		
		var media_mix_ori = calMediaMix(conversion_json_ori, data_json_ori, variable_arr);
		var contribution_ori = calContribution(data_json_ori, coefficient_json_ori, power_json_ori, lag_json_ori, variable_arr);
		var baseline = calBaseline(data_json_ori);
		var sale_ori = calSale(contribution_ori,baseline);
		//var contribution_ori_per = calContriPer(contribution_ori, sale_ori, baseline);

		
	
	};
	
	oReq.send();

});

function calMediaMix(conversion_arr, ori_data_arr, variable_arr){
	var sum = 0; 
	var media_mix_ori = [];

	// i is column
	for(var i = 0; i< variable_arr.length; i++){
		// j is row
		var sub = 0;
		for(var j = 1; j < ori_data_arr.length; j++){
			var conversion = conversion_arr[0][variable_arr[i]];
			var temp = conversion * ori_data_arr[j][i+3];
			sub += temp;
		}
		media_mix_ori.push(sub);
		sum += sub;
	}

	for(var i = 0; i<media_mix_ori.length; i++){
		media_mix_ori[i] = media_mix_ori[i]/sum;
	}
	return media_mix_ori;
	
}

function calContribution(ori_data_arr, coefficient_arr, power_arr, lag_arr, variable_arr){
			// i is column
	var contribution_arr = [];
	for(var i = 0; i<variable_arr.length; i++){
		var sub_contribution = 0;
		for(var j = 1; j<ori_data_arr.length; j++){
			if(j >= (ori_data_arr.length - lag_arr[0][variable_arr[i]])){
					continue;
				}
			var data = ori_data_arr[j][i+3];
			var coefficient = coefficient_arr[0][variable_arr[i]];
			var power = power_arr[0][variable_arr[i]];
			var temp_con = coefficient*Math.pow(data,power);
			sub_contribution += temp_con;
		}
		contribution_arr.push(sub_contribution);
	}
	return contribution_arr;
}

function calBaseline(ori_data_arr){
	var baseline = 0;
	for(var i=1; i<ori_data_arr.length;i++){
		baseline += ori_data_arr[i][1];
	}
	return baseline;
}

function calSale(contribution_arr, baseline){
	var sale = 0;
	for(var i=0; i<contribution_arr.length; i++){
		sale += contribution_arr[i];
	}
	sale += baseline;
	return sale;
}

//function calContriPer(contribution_arr, sale, baseline){
//	var contri_per_arr = [];
//	var sum = sale-baseline;
//	for(var i=0; i<contribution_arr.length; i++){
//		contri_per_arr.push(contribution_arr[i]*100/sum);
//	}
//	return contri_per_arr;
//}