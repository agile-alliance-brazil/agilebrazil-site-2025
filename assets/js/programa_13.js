
(function($) {
	
	window.initProgram = 0;

	window.program = function (day){
		window.initProgram = 1;	
		$("#program-18").css('background-color', '#063676');
		$("#program-19").css('background-color', '#063676');

		$("#estrutura-18").css('display', 'none');
		$("#estrutura-19").css('display', 'none');

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
	}

	window.popupProgram = function (day, id, posicao) {

		var dados = window.dataProgramPopup[day][id][posicao - 1];
		if (posicao == 1) {
			$("#conteudo-popup-programacao").html(`
				<div class="profile">
					<p><b>` + dados.title + `</b></p>
					<p>` + dados.descricao + `</p>
					` + ( dados.lotacao ? `<p>Capacidade: ` + dados.lotacao + ` pessoas</p>` : '') + `
				</div>
			`);

		} else {
			dados.foto = dados.foto.indexOf('drive.google.com') ?
						dados.foto.replace('drive.google.com/open?id=', 'drive.google.com/thumbnail?id=').replace('drive.google.com/file/d/', 'drive.google.com/thumbnail?id=').replace('/view?usp=sharing', '') :
						dados.foto;
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
					<p style="text-align: center;">` + ( dados.miniBiografia != null ? dados.miniBiografia : '' ) + `</p>
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
			url: "https://agileminas.com.br/chamada_agile_brazil_2025.php?atualizar="+atualizar,
			// url: "https://docs.google.com/spreadsheets/d/1alFVqB-Kzm3xYtnlHZXq2iWPFcnR62qoCXx4veoDbzg/gviz/tq?tqx=out:json",
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
							window.dataProgram[row[0]][row[1]] = '<div class="activity full-space card-program"><div style="font-weight: bold;font-size: 18px;">'+row[3]+'</div></div>';
							break;
						case "Keynote":
							window.dataProgramPopup[row[0]][row[1]] = [
								{
								},
								{
									autor: row[8] ?? '',
									miniBiografia: row[10],
									foto: row[9],
									linkedin: row[11] ? (row[11].indexOf('http') >= 0  ? row[11] : 'https://' + row[11]) : false
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
						case "Comunidade":
							var classCss = 'default';
							switch (row[4]) {
								case "Design e Gestão de Produtos e Projetos" :
									classCss = 'lideranca';
									break;
								case "Eficiência, Inovação e Transformação Digital" :
									classCss = 'raizes';
									break;
								case "Liderança, Estratégia e Gestão da Mudança" :
									classCss = 'metrica';
									break;
								case "Painel Executivo" :
									classCss = 'executivo';
									break;
								case "Arena Comunidades" :
									classCss = 'default';
									break;

							}
							if (row[7] == 'Painel Executivo') {
								classCss = 'executivo';
							}
							window.dataProgramPopup[row[0]][row[1]] = [
								{
									title: row[3],
									trilha: row[4],
									descricao: row[7],
									lotacao: row[16] ?? false
								},
								{
									autor: row[8] ?? '-',
									miniBiografia: row[10],
									foto: row[9],
									linkedin: row[11] ? (row[11].indexOf('http') >=0  ? row[11] : 'https://' + row[11]) : false
								}
							];
							if (row[12]) {
								window.dataProgramPopup[row[0]][row[1]].push(
									{
										autor: row[12],
										miniBiografia: row[14],
										foto: row[13],
										linkedin: row[15] ? (row[15].indexOf('http')  >=0  ? row[15] : 'https://' + row[15]) : false
									}
								);
							}
							window.dataProgram[row[0]][row[1]] = `<div class="activity ` + classCss + ` card-program">
								<p class="hashtag-trilha"> ` + row[4] + ` </p>`;
							if (row[4] != "Arena Comunidades") {
								window.dataProgram[row[0]][row[1]] += `<div class="local-palestra"> ` + row[5] + ` </div>`;
							}
							window.dataProgram[row[0]][row[1]] += `	<p class="title"> <div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 1)"> ` + row[3] + ` </div> </p>
								<div class="autor"> 
									<div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 2)"> ` + row[8] + ` </div>
									` + ( row[12] ? ` & <div class="text-clicavel" onclick="popupProgram('` + row[0] + `', '` + row[1] + `', 3)"> ` + row[12] + ` </div>` : '' ) + `
								</div>
							</div>`;
							break;
						case "Geral":
						case "TBD":
						case "Pitch":
							if (row[10]){
								window.dataProgramPopup[row[0]][row[1]] = [
									{
										title: row[3],
										trilha: row[4],
										descricao: row[7]
									},
									{
										autor: row[8] ?? '',
										miniBiografia: row[10],
										foto: row[9],
										linkedin: row[11] ? (row[11].indexOf('http')  >=0  ? row[11] : 'https://' + row[11]) : false
									}
								];
								if (row[12] && row[12] !== '-') {
									window.dataProgramPopup[row[0]][row[1]].push(
										{
											autor: row[12],
											miniBiografia: row[14],
											foto: row[13],
											linkedin: row[15] ? (row[15].indexOf('http')  >=0  ? row[15] : 'https://' + row[15]) : false
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
				/*
				window.dataProgram[18]['identificacao-1045-6'] = `<div class="activity default card-program">
									<div class="local-palestra"> </div>
									<p class="title"> <div class="text-clicavel">Onde o Ágil Deu Errado?</div> </p>
									<div class="autor"> 
										<div class="text-clicavel"> Ibson Cabral </div>
									</div>
								</div>`;

				window.dataProgram[18]['identificacao-1155-6'] = `<div class="activity default card-program">
									<div class="local-palestra"> </div>
									<p class="title"> <div class="text-clicavel">Como podemos usar da melhor forma a IA para execução de projetos ágeis?</div> </p>
									<div class="autor"> 
										<div class="text-clicavel">CHRISTIAN MOURA DOS SANTOS</div>
									</div>
								</div>`;
*/
				window.program(18);
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
