/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var myhaven = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $(document).on('deviceready', this.onDeviceReady);
    },
    onDeviceReady: function() {
        $("#sendPanic").on('click',myhaven.sendPanic);
        $(document).on('backbutton',myhaven.exitApp);
    },
    notify:function(type,message,cb){
        var dialog = navigator.notification,title="My Haven";
        switch(type){
            case "alert":
                dialog.alert(message,cb,title);
        }
    },
    exitApp:function(){
        navigator.app.exitApp();
    },
    sendPanic:function(){
        //var options = {enableHighAccuracy: true};
        var conn = navigator.connection,connType = conn.type;
        if(connType != conn.NONE){
            navigator.geolocation.getCurrentPosition(onSuccess,onError);
            function onSuccess(position){
                var time = position.timestamp,latitude = position.coords.latitude,longitude = position.coords.longitude;
                myhaven.notify("alert","Time:"+time+"&Lat:"+latitude+"&Lon"+longitude,null);
                $.post("http://192.168.43.190:8080/alert",{time:time,lat:latitude,lon:longitude}).
                done(function(data){
                    myhaven.notify("alert",data,null);
                });
                $('.ui-dialog').dialog('close');
            }
            function onError(){
                alert('Error getting geolocation data');
            }
        }
        else{
            alert('Sorry, no network access!');
        }
    }
};