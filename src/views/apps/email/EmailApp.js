import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react-pro'

import { Compose, Inbox, Message, Template } from './index'

const TheEmailApp = () => {
  return (
    <Template>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route exact path="inbox" name="Login Page" element={<Inbox />} />
          <Route exact path="compose" name="Register Page" element={<Compose />} />
          <Route exact path="message" name="Message" element={<Message />} />
          <Route index element={<Navigate to="/apps/email/inbox" />} />
        </Routes>
      </Suspense>
    </Template>
  )
}

export default React.memo(TheEmailApp)
