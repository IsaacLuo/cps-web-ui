$(()=>{
  let intervalTimer;
  const fetchData = ()=>{
    $.getJSON("api/state", (data)=>{
        // Work_State: 'STOP',
        // Num_BD_set: 100,
        // Diam_set: 40,
        // DateTime_set: '2022-01-22 16:34:29',
        // Setter: 'Local',
        // Num_realtime: null,
        // Num_LsatBD: null,
        // Diam_Last: null,
        // Cmd_Stop_Start: 'Stop',
        // Cmd_New_Set: null,
        // Cmd_Num_BD: null,
        // Cmd_Num_Diam: null
      $("#host-state").html(data.Work_State || 'UNKNOWN');
      $("#host-count").html(data.Num_realtime || '0');
      $("#host-target-count").html(data.Num_BD_set || '0');
      $("#diameter").html(data.Diam_set || '0');
      $("#host-operator").html(data.Setter || '--');
      $("#host-setting-timestamp").html(data.DateTime_set || '--');
      $("#last-bundle-size").html(data.Num_LsatBD || '0');
      $("#last-bundle-diameter").html(data.Diam_last || '0');

      $("#start-stop-message").html(data.Cmd_Stop_Start ? `命令${data.Cmd_Stop_Start}已发送，待执行`:".");
      $("#new-setting-message").html(data.Cmd_New_Set ? `设置${data.Cmd_Num_BD} ${data.Cmd_Num_Diam}已发送，待更新`:".");
    });
  }
  fetchData();
  intervalTimer = setInterval(fetchData, 1000);
  $("#btn-start").click(()=>{
    $.ajax({  
      type: "post",  
      url: 'api/start',  
      async: true,
      contentType: "application/json; charset=utf-8",  
      dataType: "json",  
      success: (data) => {  
          $('#start-stop-message').text("已发送");
      },
      error: (data) => {
        $('#start-stop-message').text("错误");
      }
    }); 
  });
  $("#btn-stop").click(()=>{
    $.ajax({  
      type: "post",  
      url: 'api/stop',  
      async: true,
      contentType: "application/json; charset=utf-8",  
      dataType: "json",  
      success: (data) => {  
          $('#start-stop-message').text("已发送");
      },
      error: (data) => {
        $('#start-stop-message').text("错误");
      }
    }); 
  });
  $("#remote-submit").click(()=>{
    const newCount = parseInt($("#remote-target-count").val(),10);
    const newDiameter = parseInt($("#remote-target-diameter").val(),10);
    
    if (!(newCount>0 && newDiameter>0)) {
      alert("无法识别设定值");
      return;
    }

    $.ajax({  
      type: "post",  
      url: 'api/setting',  
      async: true,
      data: JSON.stringify({                    
          newCount,
          newDiameter,
      }),  
      contentType: "application/json; charset=utf-8",  
      dataType: "json",  
      success: (data) => {  
          $('#new-setting-message').text("已提交");
      },
      error: (data) => {
        $('#new-setting-message').text("错误");
      }
    }); 
  });

})