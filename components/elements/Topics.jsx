import { useEffect, useState, useCallback } from 'react'

import ROSLIB from 'roslib'

const Topics = () => {
  const [ros, set_ros] = useState()
  const [msg, set_msg] = useState('not set')
  const [topics, set_topics] = useState('no topics polled')

  useEffect(() => {
    try {
      var rosConn = new ROSLIB.Ros({
        url: 'ws://rbt-bertha-agx:9191'
      })

      rosConn.on('connection', function() {set_msg('connected')})
      rosConn.on('error', function() {set_msg('error')})
      rosConn.on('close', function() {set_msg('close')})
      rosConn.on('reconnect', function() {set_msg('reconnect')})

      set_ros(rosConn)
    } catch {
      console.error('error connecting websockets')
    }
  }, [])

  const topicsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      topics.foreach(topic => {
        const li = document.createElement('li')
        li.innerHTML = topic
        node.appendChild(li)
      })
    }
  }, [topics])

  const getTopics = () => {
    var topicsClient = new ROSLIB.Service({
      ros : ros,
      name : '/rosapi/topics',
      serviceType : 'rosapi/Topics'
    });

    var request = new ROSLIB.ServiceRequest();

    topicsClient.callService(request, function(result) {
      console.log("Getting topics...")
      console.log(result.topics)
      set_topics(result.topics)
    });
  }

  return(<>
    <h2>Topics List</h2>
    <p>Status: {msg}</p>
    <p>Topics</p>
    <ul ref={topicsRef}></ul>
    <button onClick={getTopics}>Get Topics</button>
  </>)
}

export default Topics