
(function($) {
	
	window.initProgram = 0;

	window.program = function (day){
		window.initProgram = 1;	
		$("#program-30").css('background-color', '#063676');
		$("#program-31").css('background-color', '#063676');
		$("#program-1").css('background-color', '#063676');

		$("#estrutura-30").css('display', 'none');
		$("#estrutura-31").css('display', 'none');
		$("#estrutura-1").css('display', 'none');

		$("#estrutura-"+day).css('display', 'block');
		$("#program-"+day).css('background-color', '#147332');
		var variables = [];

		for (var index in dataProgram[day]) {
			var program = dataProgram[day][index];
			variables += `
			`+day+` `+index;
			
			arrayIdHour = index.split('-');
			indexHour = arrayIdHour[0]+'-'+arrayIdHour[1]+'-0';
			indexHourWks = arrayIdHour[0]+'-'+arrayIdHour[1]+'-wks';

			hour = window.dataHourProgram[day][indexHour];
			hourWks = window.dataHourProgram[day][indexHourWks];

			$(".response-version-screen #"+index).html(program);
			$(".full-screen #"+index).html(program);

			$(".response-version-screen #"+indexHour).html(hour);
			$(".full-screen #"+indexHour).html(hour);
			$(".response-version-screen #"+indexHourWks).html(hourWks);
		};
		
		if (day == 31) {
			$("#identificacao-1640-0").css('display', 'none');
			$("#identificacao-1640").css('display', 'none');
			$("#identificacao-1730-0").css('display', 'none');
			$("#identificacao-1730").css('display', 'none');
		}
	}

	window.popupProgram = function (day, id, posicao) {
		console.log(window.dataProgramPopup[day][id][posicao - 1], $(".backgroud-modal"));
		var dados = window.dataProgramPopup[day][id][posicao - 1];
		if (posicao == 1) {
			$("#conteudo-popup-programacao").html(`
				<div class="profile">
					<p><b>` + dados.title + `</b></p>
					<p>` + dados.descricao + `</p>
				</div>
			`);

		} else {
			$("#conteudo-popup-programacao").html(`
				<div class="profile">
					<div  style="display: none" class="image-keynotes">
					<img class="image-speaker" src="` + dados.foto + `" alt="` + dados.autor + `" />
					</div>
					<div class="image-keynotes" style="width: 125px !important;
					height: 125px !important;
					border-radius: 50% !important;
					margin: auto;
					background-image: url(` + dados.foto + `);
					background-size: cover;" alt="` + dados.autor + `">
					</div>
					<p><b>` + dados.autor + `</b></p>
					<p style="text-align: justify;">` + ( dados.miniBiografia != null ? dados.miniBiografia : '' ) + `</p>
					<ul style="margin: 0" class="icons">
						` +  (dados.linkedin ? `<li><a href="` + dados.linkedin + `" class="icon brands fa-linkedin-in" target="_blank"><span class="label">LinkedIn</span></a></li> ` : '') + `
						<!-- <li><a href="{{ speaker.twitter }}" class="icon brands fa-twitter" target="_blank"><span class="label">Twitter</span></a></li>
						<li><a href="{{ speaker.site }}" class="icon solid fas fa-link" target="_blank"><span class="label">Website</span></a></li>
						<li><a href="{{ speaker.spotify }}" class="icon brands fa-spotify" target="_blank"><span class="label">Podcast</span></a></li> -->
					</ul>
				</div>
			`);

		}
		$(".backgroud-modal").show();
		$(".backgroud-modal").animate({opacity:1},5);
	}

	setTimeout(function () {
		$(".backgroud-modal").on( "click", function() {
			$(".backgroud-modal").hide();
		} );
	}, 2000);

	window.iniciarProgramacao = function (atualizar) {
		$.ajax({
			type: 'GET',
			url: "https://docs.google.com/spreadsheets/d/1P1qYsxAniUVvVpS40mO271Oa3WO_GvMqYwcoSsXcmtM/gviz/tq?tqx=out:json",
			// url: 'https://docs.google.com/spreadsheets/d/1P1qYsxAniUVvVpS40mO271Oa3WO_GvMqYwcoSsXcmtM/gviz/tq?tqx=out:json',
			crossDomain:true,
			success: function(responseText){
				responseJSON = JSON.parse(
					responseText.slice(47, -2)
				);
				
				var rowsArray = [];
				responseJSON.table.rows.forEach(function(row){
					var rowArray = [];
					row.c.forEach(function(prop){ if (prop !== null) { rowArray.push(prop.v); } else {rowArray.push(null);} });
					rowsArray.push(rowArray);
				});

				window.dataProgram = {};
				window.dataHourProgram = {};
				window.dataProgramPopup = {};
				rowsArray.forEach(function(row){
					if (window.dataProgram[row[0]] === undefined) {
						window.dataProgram[row[0]] = [];
						window.dataProgramPopup[row[0]] = [];
						window.dataHourProgram[row[0]] = [];
					} 
					console.log(row[1]);
					arrayIdHour = row[1].split('-');
					if (row[6] == "Workshop") {
						window.dataHourProgram[row[0]][arrayIdHour[0]+'-'+arrayIdHour[1]+'-wks'] = row[2];
					} else {
						window.dataHourProgram[row[0]][arrayIdHour[0]+'-'+arrayIdHour[1]+'-0'] = row[2];
					}
					switch(row[6]) {
						case "Coffee": 
							window.dataProgram[row[0]][row[1]] = '<div class="activity full-space card-program">'+row[3]+'</div>';
							break;
						case "Intervalo": 
							window.dataProgram[row[0]][row[1]] = '<div  class="interval card-program">'+row[3]+'</div>';
							break;
						case "Almoço": 
							window.dataProgram[row[0]][row[1]] = '<div class="activity full-space card-program">'+row[3]+'</div>';
							break;
						case "Encerramento": 
							window.dataProgram[row[0]][row[1]] = '<div class="activity full-space card-program"><div style="margin-top: 25px;font-weight: bold;font-size: 18px;">'+row[3]+'</div></div>';
							break;
						case "Keynote":
							window.dataProgramPopup[row[0]][row[1]] = [
								{
								},
								{
									autor: row[8],
									miniBiografia: row[10],
									foto: row[9],
									linkedin: row[11] ?? false
								}
							];
							window.dataProgram[row[0]][row[1]] = `<div class="activity full-space keynote card-program">
								<div  class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 2)">
									<p class="keynote-program">`+row[3]+`</p>
								</div>
							</div>`;
							break;
						case "Palestra":
						case "Workshop":
							var classCss = '';
							switch (row[4]) {
								case "Produtos e Foco no Cliente" :
									classCss = 'cliente';
									break;
								case "Liderança e Agilidade Estratégica" :
									classCss = 'lideranca';
									break;
								case "Futuro da Agilidade" :
									classCss = 'futuro';
									break;
								case "Raízes da Agilidade" :
									classCss = 'raizes';
									break;
								case "Métricas e Inteligência com Dados" :
									classCss = 'metrica';
									break;

							}
							window.dataProgramPopup[row[0]][row[1]] = [
								{
									title: row[3],
									trilha: row[4],
									descricao: row[7]
								},
								{
									autor: row[8],
									miniBiografia: row[10],
									foto: row[9],
									linkedin: row[11] ?? false
								}
							];
							if (row[12]) {
								window.dataProgramPopup[row[0]][row[1]].push(
									{
										autor: row[12],
										miniBiografia: row[14],
										foto: row[13],
										linkedin: row[15] ?? false
									}
								);
							}
							window.dataProgram[row[0]][row[1]] = `<div class="activity ` + classCss + ` card-program">
								<p class="hashtag-trilha"> ` + row[4] + ` </p>
								<div class="local-palestra"> ` + row[5] + ` </div>
								<p class="title"> <div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 1)"> ` + row[3] + ` </div> </p>
								<div class="autor"> 
									<div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 2)"> ` + row[8] + ` </div>
									` + ( row[12] ? ` & <div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 3)"> ` + row[12] + ` </div>` : '' ) + `
								</div>
							</div>`;
							break;
						case "Geral":
						case "Pitch":
							if (row[10]){
								window.dataProgramPopup[row[0]][row[1]] = [
									{
										title: row[3],
										trilha: row[4],
										descricao: row[7]
									},
									{
										autor: row[8],
										miniBiografia: row[10],
										foto: row[9],
										linkedin: row[11] ?? false
									}
								];
								if (row[12]) {
									window.dataProgramPopup[row[0]][row[1]].push(
										{
											autor: row[12],
											miniBiografia: row[14],
											foto: row[13],
											linkedin: row[15] ?? false
										}
									);
								}
								window.dataProgram[row[0]][row[1]] = `<div class="activity default card-program">
									<div class="local-palestra"> ` + row[5] + ` </div>
									<p class="title"> <div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 1)"> ` + row[3] + ` </div> </p>
									<div class="autor"> 
										<div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 2)"> ` + row[8] + ` </div>
										` + ( row[12] ? ` & <div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 3)"> ` + row[12] + ` </div>` : '' ) + `
									</div>
								</div>`;
							} else {
								window.dataProgram[row[0]][row[1]] = `<div class="activity default card-program">
									<div class="local-palestra"> ` + row[5] + ` </div>
									<p class="title"> <div > ` + row[3] + ` </div> </p>
								</div>`;
							}
							break;
					}

				});
				window.program(30);
				$("#loading-atualizar").css('display', 'none');
				
			},
			error: function(result){
				console.log('Error', result);
				$("#program-intregration").html('Programação indisponivel no momento');
			}
		});
	}
	window.iniciarProgramacao(0);
	


	window.atulizarProgramacao = function () {
		$("#loading-atualizar").css('display', 'inline');
		window.iniciarProgramacao(1);
	}

})(jQuery);
