(function ($) {
    "use strict";
    //select and booked seat
    function selectSeat() {
        let selectedSeats = $('.seat.selected');
        let seatDetails = ``;
        let price = $('input[name=price]').val();
        let subtotal = 0;
        let currency = 'USD';
        let seats = '';
        if (selectedSeats.length > 0) {
            $('.booked-seat-details').removeClass('d-none');
            $.each(selectedSeats, function (i, value) {
                seats += $(value).data('seat') + ',';
                seatDetails += `<span class="list-group-item d-flex justify-content-between">${$(value).data('seat')} <span>${price} ${currency}</span></span>`;
                subtotal = subtotal + parseFloat(price);
            });

            $('input[name=seats]').val(seats);
            $('.selected-seat-details').html(seatDetails);
            $('.selected-seat-details').append(`<span class="list-group-item d-flex justify-content-between">Sub total<span>${subtotal} ${currency}</span></span>`);
        } else {
            $('.selected-seat-details').html('');
            $('.booked-seat-details').addClass('d-none');
        }
    }
})(jQuery);