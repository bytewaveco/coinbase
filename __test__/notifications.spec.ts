import { _client } from '.'
import { type CoinbaseNotification } from '../src/notifications'

function validateNotification(notification: CoinbaseNotification) {
  expect(notification).toBeInstanceOf(Object)
  expect(notification.id).toBeDefined()
  expect(notification.type).toBeDefined()

  expect(notification.data).toBeInstanceOf(Object)
  expect(notification.data.id).toBeDefined()
  expect(notification.data.status).toBeDefined()
  expect(notification.data.payment_method).toBeInstanceOf(Object)
  expect(notification.data.payment_method.id).toBeDefined()
  expect(notification.data.payment_method.resource).toBeDefined()
  expect(notification.data.payment_method.resource_path).toBeDefined()
  expect(notification.data.transaction).toBeInstanceOf(Object)
  expect(notification.data.transaction.id).toBeDefined()
  expect(notification.data.transaction.resource).toBeDefined()
  expect(notification.data.transaction.resource_path).toBeDefined()
  expect(notification.data.amount).toBeInstanceOf(Object)
  expect(notification.data.amount.amount).toBeDefined()
  expect(notification.data.amount.currency).toBeDefined()

  if (notification.data.total) {
    expect(notification.data.total).toBeInstanceOf(Object)
    expect(notification.data.total.amount).toBeDefined()
    expect(notification.data.total.currency).toBeDefined()
  }

  expect(notification.data.subtotal).toBeInstanceOf(Object)
  expect(notification.data.subtotal.amount).toBeDefined()
  expect(notification.data.subtotal.currency).toBeDefined()
  expect(notification.data.created_at).toBeDefined()
  expect(notification.data.updated_at).toBeDefined()
  expect(notification.data.resource).toBeDefined()
  expect(notification.data.resource_path).toBeDefined()
  expect(notification.data.committed).toBeDefined()
  expect(notification.data.instant).toBeDefined()
  expect(notification.data.fee).toBeInstanceOf(Object)
  expect(notification.data.fee.amount).toBeDefined()
  expect(notification.data.fee.currency).toBeDefined()
  expect(notification.data.payout_at).toBeDefined()

  expect(notification.additional_data).toBeInstanceOf(Object)

  expect(notification.user).toBeInstanceOf(Object)
  expect(notification.user.id).toBeDefined()
  expect(notification.user.resource).toBeDefined()
  expect(notification.user.resource_path).toBeDefined()

  expect(notification.account).toBeInstanceOf(Object)
  expect(notification.account.id).toBeDefined()
  expect(notification.account.resource).toBeDefined()
  expect(notification.account.resource_path).toBeDefined()

  expect(notification.delivery_attempts).toBeDefined()
  expect(notification.created_at).toBeDefined()
  expect(notification.resource).toBeDefined()
  expect(notification.resource_path).toBeDefined()
}

describe.concurrent('Notifications API', async () => {
  it('returns the list of notifications', async () => {
    const client = _client()

    const notifications = await client.notifications.listNotifications()

    expect(notifications).toBeInstanceOf(Array)
    expect(notifications.length).toBeGreaterThan(0)

    for (const notification of notifications) {
      validateNotification(notification)
    }
  })

  it('returns single notifications', async () => {
    const client = _client()

    const notifications = await client.notifications.listNotifications()
    const notification = await client.notifications.getNotification(notifications[0].id)

    validateNotification(notification)
  })
})
