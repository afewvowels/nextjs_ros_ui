import Image from 'next/image'

import { useEffect, useState, useCallback } from 'react'

import ROSLIB from 'roslib'

import styles from 'styles/Home.module.css'

const Topics = () => {
  const [ros, set_ros] = useState()
  const [msg, set_msg] = useState('not set')
  const [topics, set_topics] = useState(null)

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
    if (node != null && topics != null) {
      node.innerHTML = ''
      topics.forEach(topic => {
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
      set_topics(result.topics)
    });
  }

  return(<>
    <h2>Topics List</h2>
    <p>Status: {msg}</p>
    <img className={styles.videoStream} alt='ROS camera tag' src="http://rbt-bertha-agx:8080/stream?topic=/camera/color/image_raw&amp;quality=20"/>
    <p>Topics</p>
    <ul ref={topicsRef}></ul>
    <button onClick={getTopics}>Get Topics</button>
  </>)
}

export default Topics