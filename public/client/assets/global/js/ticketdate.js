
    const datePicker = $('.date-range').daterangepicker({
        autoUpdateInput: true,
        singleDatePicker: true,
        minDate: new Date(),
        locale: {
            format: 'DD-MM-YYYY'  // Định dạng ngày thành dd-MM-yyyy
        }
    })
