import React from 'react'

const ChatInput = () => {

  return (
    <div className="chat-input">
      <input type="text" id="chat-input" autoComplete='off' autoCorrect='off' autoCapitalize='off' />
    </div>
  )

}

export default React.memo(ChatInput)