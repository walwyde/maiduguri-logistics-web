// 'use client';

// import { Clock, CheckCircle, Truck } from 'lucide-react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import useAuth from '@/utils/useAuth';
// import { DeliveryCard } from '@/components/DeliveryCard';
// import {
//   fetchRiderDeliveries,
//   updateDeliveryStatus,
// } from '@/lib/api/bookings';

// export default function RiderDeliveriesPage() {
//   const { token } = useAuth();
//   const queryClient = useQueryClient();

//   // ============================
//   // Fetch deliveries
//   // ============================
//   const {
//     data: deliveries = [],
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ['rider-deliveries'],
//     queryFn: () => fetchRiderDeliveries(token),
//     enabled: !!token,
//     retry: 1,
//   });

//   // ============================
//   // Update delivery status
//   // ============================
//   const mutation = useMutation({
//     mutationFn: ({ id, status }) =>
//       updateDeliveryStatus({ id, status, token }),
//     onSuccess: () => {
//       toast.success('Delivery updated');
//       queryClient.invalidateQueries(['rider-deliveries']);
//     },
//     onError: (err) => {
//       toast.error(err.message || 'Failed to update delivery');
//     },
//   });

//   // ============================
//   // Derived states
//   // ============================
//   const pending = deliveries.filter(
//     d => d.status !== 'delivered' || !d.payment_confirmed
//   );

//   const completed = deliveries.filter(
//     d => d.status === 'delivered' && d.payment_confirmed
//   );

//   // ============================
//   // UI STATES
//   // ============================

//   if (isLoading) {
//     return (
//       <div className="p-6 text-muted-foreground">
//         Loading your deliveries…
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-6 text-destructive">
//         {error.message || 'Unable to load deliveries'}
//       </div>
//     );
//   }

//   if (deliveries.length === 0) {
//     return (
//       <div className="p-6 flex flex-col items-center justify-center text-center gap-3">
//         <Truck className="w-12 h-12 text-muted-foreground" />
//         <h2 className="text-lg font-semibold">No deliveries yet</h2>
//         <p className="text-sm text-muted-foreground">
//           Assigned deliveries will appear here once you accept a job.
//         </p>
//       </div>
//     );
//   }

//   // ============================
//   // MAIN RENDER
//   // ============================
//   return (
//     <div className="p-6 space-y-10">
//       <h1 className="text-2xl font-bold">My Deliveries</h1>

//       {/* Pending */}
//       <section>
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <Clock className="w-5 h-5 text-warning" />
//           Pending Deliveries
//         </h2>

//         {pending.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No pending deliveries.
//           </p>
//         ) : (
//           <div className="space-y-4">
//             {pending.map(delivery => (
//               <DeliveryCard
//                 key={delivery.booking_id}
//                 delivery={delivery}
//                 loading={mutation.isPending}
//                 onUpdate={(id, status) =>
//                   mutation.mutate({ id, status })
//                 }
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Completed */}
//       <section>
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <CheckCircle className="w-5 h-5 text-success" />
//           Completed Deliveries
//         </h2>

//         {completed.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No completed deliveries yet.
//           </p>
//         ) : (
//           <div className="space-y-4">
//             {completed.map(delivery => (
//               <DeliveryCard
//                 key={delivery.booking_id}
//                 delivery={delivery}
//                 completed
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

'use client';

import { Clock, CheckCircle, Truck, Package2, MapPin, ArrowRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useAuth from '@/utils/useAuth';
import { fetchRiderDeliveries, updateDeliveryStatus } from '@/lib/api/bookings';

const confirmPayment = async (id, token) => {
  const res = await fetch(`/api/bookings/${id}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to confirm payment');
  }
  return res.json();
};

const DeliveryCard = ({ delivery, loading, onUpdate, onConfirmPayment, completed }) => {
  const {
    booking_id,
    status,
    payment_status,
    payment_method,
    pickup_address,
    delivery_address,
    customer_name,
    customer_phone,
    package_description,
    total_price_naira,
  } = delivery;

  const isPaymentNeeded = status === 'delivered' && payment_method === 'cash' && payment_status !== 'paid';

  let currentStatusLabel = status;
  if (status === 'accepted') currentStatusLabel = 'Pending Pickup';
  else if (status === 'in_transit') currentStatusLabel = 'In Transit';
  else if (status === 'delivered' && !completed) currentStatusLabel = 'Awaiting Payment Confirmation';
  else if (completed) currentStatusLabel = 'Completed';

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-background shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Package2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Booking #{booking_id}</h3>
        </div>
        <span className={`text-sm px-2 py-1 rounded-full ${completed ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
          {currentStatusLabel}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <p><strong>From:</strong> {pickup_address}</p>
        </div>
        <div className="flex items-start gap-2">
          <ArrowRight className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <p><strong>To:</strong> {delivery_address}</p>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <p><strong>Customer:</strong> {customer_name} ({customer_phone})</p>
        <p><strong>Package:</strong> {package_description}</p>
        <p><strong>Price:</strong> ₦{total_price_naira}</p>
      </div>

      {!completed && (
        <div className="flex gap-2">
          {status === 'accepted' && (
            <button
              className="btn btn-primary flex-1"
              disabled={loading}
              onClick={() => onUpdate(booking_id, 'in_transit')}
            >
              Mark In Transit
            </button>
          )}
          {status === 'in_transit' && (
            <button
              className="btn btn-primary flex-1"
              disabled={loading}
              onClick={() => onUpdate(booking_id, 'delivered')}
            >
              Mark Delivered
            </button>
          )}
          {isPaymentNeeded && onConfirmPayment && (
            <button
              className="btn btn-success flex-1"
              disabled={loading}
              onClick={() => onConfirmPayment(booking_id)}
            >
              Confirm Payment Received
            </button>
          )}
          {status === 'accepted' && (
            <button
              className="btn btn-destructive flex-1"
              disabled={loading}
              onClick={() => onUpdate(booking_id, 'rejected')}
            >
              Reject Delivery
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function RiderDeliveriesPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Fetch deliveries
  const {
    data: deliveries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['rider-deliveries'],
    queryFn: () => fetchRiderDeliveries(token),
    enabled: !!token,
    retry: 1,
  });

  // Update delivery status
  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateDeliveryStatus({ id, status, token }),
    onSuccess: () => {
      toast.success('Delivery status updated');
      queryClient.invalidateQueries(['rider-deliveries']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update delivery');
    },
  });

  // Confirm payment
  const confirmMutation = useMutation({
    mutationFn: ({ id }) => confirmPayment(id, token),
    onSuccess: () => {
      toast.success('Payment confirmed');
      queryClient.invalidateQueries(['rider-deliveries']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to confirm payment');
    },
  });

  // Derived states
  const isCompleted = (d) =>
    d.status === 'delivered' &&
    (d.payment_status === 'paid' || d.payment_method === 'bank_transfer');

  const pending = deliveries.filter((d) => !isCompleted(d));
  const completed = deliveries.filter(isCompleted);

  // UI STATES
  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading your deliveries…</div>;
  }

  if (isError) {
    return <div className="p-6 text-destructive">{error.message || 'Unable to load deliveries'}</div>;
  }

  if (deliveries.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center gap-3">
        <Truck className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">No deliveries yet</h2>
        <p className="text-sm text-muted-foreground">
          Assigned deliveries will appear here once you accept a job.
        </p>
      </div>
    );
  }

  // MAIN RENDER
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">My Deliveries</h1>

      {/* Pending */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-warning" />
          Active Deliveries
        </h2>

        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active deliveries.</p>
        ) : (
          <div className="space-y-4">
            {pending.map((delivery) => (
              <DeliveryCard
                key={delivery.booking_id}
                delivery={delivery}
                loading={updateMutation.isPending || confirmMutation.isPending}
                onUpdate={(id, status) => updateMutation.mutate({ id, status })}
                onConfirmPayment={(id) => confirmMutation.mutate({ id })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Completed */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          Completed Deliveries
        </h2>

        {completed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No completed deliveries yet.</p>
        ) : (
          <div className="space-y-4">
            {completed.map((delivery) => (
              <DeliveryCard key={delivery.booking_id} delivery={delivery} completed />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}