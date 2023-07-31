import { Alert } from "react-bootstrap"
import { RecipientStatuses } from "../../interfaces/emails"
import { useEffect, useState } from "react"

interface AlertParent {
  recipientStatuses: RecipientStatuses
}

export default function AlertParent({ recipientStatuses }: AlertParent) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    console.log(recipientStatuses)
    setShow(true)
    setTimeout(() => {
      setShow(false)
    }, 5000)
  }, [recipientStatuses])

  return (
    <div className="alert-parent">
      {recipientStatuses.successfullyReceivedEmail ?
        recipientStatuses.successfullyReceivedEmail.map((recipient, index) => (
          <Alert variant="success" className="alert-message" key={index} show={show} >
            <strong>{recipient.name}</strong> [{recipient.email}] has received their invoice!
          </Alert>
        )) : null}
      {recipientStatuses.emailReceiptError ?
        recipientStatuses.emailReceiptError.map((recipient, index) => (
          <Alert variant="success" className="alert-message" key={index}>
            There has been an error with <strong>{recipient.name}'s</strong> [{recipient.email}] invoice.
          </Alert>
        )) : null}
    </div>
  )
}
