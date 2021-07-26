import { useEffect, useState } from 'react'

import ROSLIB from 'roslib'

const Topics = () => {
  const [ros, set_ros] = useState()
  const [msg, set_msg] = useState('not set')
  const [topics, set_topics] = useState('no topics polled')

  useEffect(() => {
    var rosConn = new ROSLIB.Ros({
      url: 'ws://localhost:9090'
    })

    rosConn.on('connection', function() {set_msg('connected')})
    rosConn.on('error', function() {set_msg('error')})
    rosConn.on('close', function() {set_msg('close')})
    rosConn.on('reconnect', function() {set_msg('reconnect')})

    set_ros(rosConn)
  }, [])

  const getTopics = () => {
    try {
      var rosConn = new ROSLIB.Ros({
        url: 'ws://rbt-bertha-agx:9090'
      })
    }
    catch (e) {
      console.error('terrible error connecting to websockets')
    }

    let topicsClient = new ROSLIB.Service({
      ros: rosConn,
      name: '/rosapi/topics',
      serviceType: 'rosapi/Topics'
    })

    let request = new ROSLIB.ServiceRequest()

    topicsClient.callService(request, function(result) {
      console.log(result.topics)
      set_topics(result.topics)
    })
  }

  return(<>
    <h2>Topics List</h2>
    <p>Status: {msg}</p>
    <p>Topics: {topics}</p>
    <ul></ul>
    <button onClick={getTopics}>Get Topics</button>
  </>)
}

export default Topics