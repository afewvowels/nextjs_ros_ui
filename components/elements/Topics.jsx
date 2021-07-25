import { useEffect, useState } from 'react'

import ROSLIB from 'roslib'

const Topics = () => {
  const [ros, set_ros] = useState()
  const [msg, set_msg] = useState('not set')

  useEffect(() => {
    var rosConn = new ROSLIB.Ros()

    rosConn.on('connection', function() {set_msg('connected')})
    rosConn.on('error', function() {set_msg('error')})
    rosConn.on('close', function() {set_msg('close')})



    set_ros(rosConn)
  }, [ros])

  const getTopics = () => {
    ros.connect('wss://localhost:9090', function() {set_msg('connecting')})
  }

  return(<>
    <h2>Topics List</h2>
    <p>Status: {msg}</p>
    <ul></ul>
    <button onClick={getTopics}>Get Topics</button>
  </>)
}

export default Topics