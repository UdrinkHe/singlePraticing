new Vue({
    el:'#app',
    data:{
        searchCity:'',//搜索的城市
        currentCity:'深圳',//当前城市
        currentTime:'11:47',//当前时间
        currentDate:'2024年8月5日',//当前日期
        cityMain:{  //城市详细天气数据(最高温、最低温、日出时间、日落时间、湿度、气压、风速、紫外线、天气类型)
            nowTemp:'24°C',
            maxTemp:'100°C',
            minTemp:'0°C',
            sunRise:'8:00',
            sunSet:'17:00',
            humidity:'41%',
            pressure:'997hPa',
            windSpeed:'3km/h',
            uv:'8',
            weatherType:'晴',
            weatherTypeIcon:'qi-100'
        },
        fiveDayLike:[ //五天气候(类型、温度、星期)
            {
                todayBefore:1,//一天之后
                dayOfWeekCH:'星期天',
                dayOfWeekEN:'Sunday',
                averageTemp:'20°C',
                weatherType:'',
                weatherIcon:'qi-100'
            },
            {
                todayBefore:2,//一天之后
                dayOfWeekCH:'星期一',
                dayOfWeekEN:'Monday',
                averageTemp:'21°C',
                weatherType:'',
                weatherIcon:'qi-100'
            },
            {
                todayBefore:3,//一天之后
                dayOfWeekCH:'星期二',
                dayOfWeekEN:'Tuesday',
                averageTemp:'19°C',
                weatherType:'',
                weatherIcon:'qi-100'
            },
            {
                todayBefore:4,//一天之后
                dayOfWeekCH:'星期三',
                dayOfWeekEN:'Wednesday',
                averageTemp:'22°C',
                weatherType:'',
                weatherIcon:'qi-100'
            },
            {
                todayBefore:5,//一天之后
                dayOfWeekCH:'星期四',
                dayOfWeekEN:'Thursday',
                averageTemp:'23°C',
                weatherType:'',
                weatherIcon:'qi-100'
            }
        ],
        hourlyLike:[ //当天未来天气(类型、温度、时间、风向)
            {
                time:'12:00',//三小时之后
                averageTemp:'21°C',
                weatherTypeIcon:'qi-100',
                windDirectionIcon:'北风',
                windSpeed:'3km/h'
            },
            {
                time:'15:00',//六小时之后
                averageTemp:'21°C',
                weatherTypeIcon:'qi-100',
                windDirectionIcon:'北风',
                windSpeed:'3km/h'
            },
            {
                time:'18:00',//九小时之后
                averageTemp:'21°C',
                weatherTypeIcon:'qi-100',
                windDirectionIcon:'北风',
                windSpeed:'3km/h'
            },
            {
                time:'21:00',//十二小时之后
                averageTemp:'21°C',
                weatherTypeIcon:'qi-100',
                windDirectionIcon:'北风',
                windSpeed:'3km/h'
            },
        ]
    },
    methods:{   //和风天气用户key:b38053db3dee4ae39586a04fbff4ff1c
        getWeatherMain(){
            let locationId=0;
            const mykey='b38053db3dee4ae39586a04fbff4ff1c'
            let that=this;
            axios({
                method:'get',
                url:'https://geoapi.qweather.com/v2/city/lookup',//根据城市名字查询城市id
                params:{
                    location:this.searchCity,     //无结果是404
                    key:mykey
                }
            }).then((respose)=>{//用箭头函数可以使下文this指向上文
                console.log(this.searchCity)
                console.log(respose.data)
                let data=respose.data;
                console.log(data.location)
                if(data.code!=200){//请求错误
                    alert('请求错误')
                }
                else{
                    for(let i in data.location){
                        if(data.location[i].name===this.searchCity){
                            console.log('搜寻成功,id为'+data.location[i].id)
                            this.currentCity=this.searchCity;
                            locationId=data.location[i].id;//找到城市或区id之后查找详细天气状况
                        }
                    }
                    if(locationId==0){
                        alert('请输入正确的城市或城区名字')
                    }
                    else{//获取到locationId则继续寻找
                        //获取当天天气以及未来五天天气状况
                        axios({
                            methods:'get',
                            url:'https://devapi.qweather.com/v7/weather/now',
                            params:{
                                key:mykey,
                                location:locationId
                            }
                        }).then((respose)=>{
                            console.log('实时天气')
                            console.log(respose.data)
                            
                            if(respose.data.code!=200){
                                alert('请求错误，获取当天天气失败')
                            }
                            else{
                                //实时时间变更
                                this.currentDate=respose.data.updateTime.substr(0,4)+'年'+respose.data.updateTime.substr(5,2)+'月'+respose.data.updateTime.substr(8,2)+'日'
                                this.currentTime=respose.data.updateTime.substr(11,5)
                                //更新今日天气
                                let nowData=respose.data.now
                                // this.cityMain.maxTemp=nowData[0].tempMax;//最高温度
                                // this.cityMain.minTemp=nowData[0].tempMax;//最低温度
                                this.cityMain.nowTemp=nowData.temp+'°C';//当前温度温度
                                // this.cityMain.sunRise=nowData[0].tempMax;//日出
                                // this.cityMain.sunSet=nowData[0].tempMax;//日落
                                this.cityMain.humidity=nowData.humidity+'%';//湿度
                                this.cityMain.pressure=nowData.pressure+'hPa';//大气压
                                this.cityMain.windSpeed=nowData.windSpeed+'km/h';//风速
                                this.cityMain.weatherType=nowData.text;//当前天气类型
                                this.cityMain.weatherTypeIcon='qi-'+nowData.icon;//天气类型图标
                                //更新当天以及未来五天天气
                                axios({
                                    methods:'get',
                                    url:'https://devapi.qweather.com/v7/weather/7d',
                                    params:{
                                        key:mykey,
                                        location:locationId
                                    }
                                }).then((respose)=>{
                                    console.log('未来几天天气')
                                    console.log(respose.data)
                                    if(respose.data.code!=200){
                                        alert('获取未来五天天气失败')
                                    }
                                    else{//获取未来几天天气
                                        let dailyData=respose.data.daily;
                                        this.cityMain.maxTemp=dailyData[0].tempMax;//最高温度
                                        this.cityMain.minTemp=dailyData[0].tempMin;//最低温度
                                        this.cityMain.sunRise=dailyData[0].sunrise;//日出
                                        this.cityMain.sunSet=dailyData[0].sunset;//日落
                                        this.cityMain.uv=dailyData[0].uvIndex;//紫外线指数
                                        this.fiveDayLike=[];
                                        const weekArray = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                                        for(let i=1;i<=5;i++)//未来五天粗略天气
                                        {  

                                           let newDailyData={
                                            todayBefore:i,
                                            dayOfWeekCH:weekArray[new Date(dailyData[i].fxDate).getDay()],//星期几
                                            averageTemp:(parseInt(dailyData[i].tempMax)+parseInt(dailyData[i].tempMin))/2+'°C',//平均温度
                                            weatherIcon:'qi-'+dailyData[i].iconDay
                                           }
                                           this.fiveDayLike.push(newDailyData);
                                        }
                                        //获取小时天气信息
                                        axios({
                                            methods:'get',
                                            url:'https://devapi.qweather.com/v7/weather/24h',
                                            params:{
                                                key:mykey,
                                                location:locationId
                                            }
                                        }).then((respose)=>{
                                            console.log('小时天气')
                                            console.log(respose.data)
                                            if(respose.data.code!=200){
                                                alert('获取小时天气失败')
                                            }
                                            else{
                                                this.hourlyLike=[];
                                                let horlyData=respose.data.hourly;
                                                for(let i=2;i<=11;i+=3){
                                                    let newHourlyData={
                                                        time:horlyData[i].fxTime.substr(11,5),
                                                        averageTemp:horlyData[i].temp+'°C',
                                                        weatherTypeIcon:'qi-'+horlyData[i].icon,
                                                        windDirectionIcon:horlyData[i].windDir,
                                                        windSpeed:horlyData[i].windSpeed+'km/h'
                                                    }
                                                    this.hourlyLike.push(newHourlyData)
                                                }
                                                console.log(this.hourlyLike)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
            console.log('完毕')
            console.log(this.hourlyLike)
        },
    },
    }
)