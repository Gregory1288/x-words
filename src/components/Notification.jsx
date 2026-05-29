import React from 'react'

const Notification = ({showNotification}) => {
  return (
    <div className={`notification-container ${showNotification ? 'show' : ''}`}>
        <p>This letter has already been entered</p>
    </div>
  )
}

export default Notification