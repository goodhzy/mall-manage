import React,{useState,useEffect} from 'react'
import {report} from './service'
import ReactEcharts from 'echarts-for-react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const Report = (props)=>{
    const [reportData,setReport] = useState({})
    useEffect(()=>{
        report().then(res=>{
            setReport(res.data)
        })
    },[])
    return (
        <PageHeaderWrapper>
        <ReactEcharts option={reportData} />
        </PageHeaderWrapper>
    )
}

export default Report