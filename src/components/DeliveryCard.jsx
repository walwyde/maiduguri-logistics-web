function DeliveryCard({ delivery, onUpdate, loading, completed = false }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{delivery.pickup_address}</p>
        <p className="text-sm text-muted-foreground">
          → {delivery.dropoff_address}
        </p>

        {delivery.status === 'delivered' && !delivery.payment_confirmed && (
          <p className="text-xs text-warning mt-1">
            Awaiting customer confirmation
          </p>
        )}
      </div>

      {!completed && (
        <div className="flex gap-2">
          {delivery.status === 'accepted' && (
            <button
                disabled={loading}
              onClick={() => onUpdate(delivery.booking_id, 'in_transit')}
              className=" disabled:opacity-50 disabled:pointer-events-none px-3 py-1 rounded-lg bg-primary text-primary-foreground"
            >
              Picked Up
            </button>
          )}

          {delivery.status === 'in_transit' && (
            <button
            disabled={loading}
              onClick={() => onUpdate(delivery.booking_id, 'delivered')}
              className=" disabled:opacity-50 disabled:pointer-events-none px-3 py-1 rounded-lg bg-success text-success-foreground"
            >
              Mark Delivered
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { DeliveryCard };
