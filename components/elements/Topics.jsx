import Image from 'next/image'

import { useEffect, useState, useCallback } from 'react'

import ROSLIB from 'roslib'

import styles from 'styles/Home.module.css'

const Topics = () => {
  const [ros, set_ros] = useState()
  const [msg, set_msg] = useState('not set')
  const [topics, set_topics] = useState(null)
  const [camera_topic, set_camera_topic] = useState('camera/color/image_raw')
  const [battery_topic, set_battery_topic] = useState()
  const [cv_pub, set_cv_pub] = useState()

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
      set_topics(result.topics.sort())
    });
  }

  const progressRef = useCallback(node => {
    if (node != null && battery_topic != undefined) {
      node.innerHTML = ''
      if (battery_topic[0] > 0) {
        const progress = document.createElement('progress')
        progress.max = 100
        progress.value = battery_topic[0]
        node.appendChild(progress)
      } else {
        const progress = document.createElement('progress')
        progress.max = 100
        progress.value = 0
        node.appendChild(progress)
      }
    }
  }, [battery_topic])

  const getBattery = () => {
    let battTop = new ROSLIB.Topic({
      ros: ros,
      name: 'Mecanum_Battery',
      messageType: 'std_msgs/String'
    })

    battTop.subscribe(function(msg) {
      console.log('msg: ' + msg.data)
      set_battery_topic(msg.data.split(','))
    })
  }

  const sendCmdVelLeft = () => {
    let cmd_vel_listener = new ROSLIB.Topic({
      ros: ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    })

    let twist = new ROSLIB.Message({
      linear: {x: 0, y: 0, z: 0},
      angular: {x: 0, y: 0, z: -0.5}
    })
    cmd_vel_listener.publish(twist)
  }

  const sendCmdVelRight = () => {
    let cmd_vel_listener = new ROSLIB.Topic({
      ros: ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    })

    let twist = new ROSLIB.Message({
      linear: {x: 0, y: 0, z: 0},
      angular: {x: 0, y: 0, z: 0.5}
    })
    cmd_vel_listener.publish(twist)
  }

  const batteryRef = useCallback(node => {
    if (node != null && battery_topic != undefined) {
      node.innerHTML = ''
      const h2 = document.createElement('h2')
      if (battery_topic[0] > 0) {
        h2.innerHTML = 'Battery: ' + battery_topic[0] + '%'
      } else {
        h2.innerHTML = 'Battery: 0%'
      }
      node.appendChild(h2)
    } else if (node != null) {
      const h2 = document.createElement('h2')
      h2.innerHTML = 'Battery: 0%'
      node.appendChild(h2)
    }
  })

  return(<>
    <p>Status: {msg}</p>
    <img className={styles.videoStream} alt='ROS camera tag' src={`http://rbt-bertha-agx:8080/stream?topic=/${camera_topic}&amp;quality=20`}/>
    <span ref={batteryRef}></span>
    <button onClick={getBattery}>Get Battery</button>
    <span ref={progressRef}></span>
    <button onClick={sendCmdVelLeft}>Left</button>
    <button onClick={sendCmdVelRight}>Right</button>
    <h2>Topics List</h2>
    <p>Topics</p>
    <ul ref={topicsRef}></ul>
    <button onClick={getTopics}>Get Topics</button>
  </>)
}

export default Topics