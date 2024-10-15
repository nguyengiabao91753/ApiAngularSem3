import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { debounceTime, Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../../service/applayout.service';
import { BookingService } from '../../../service/booking.service';
import { Booking } from '../../../entity/booking.entity';
import { BookingDetail } from '../../../entity/bookingdetail.entity';
import { AccountUserService } from '../../../service/accountUser.service';
import { AccountUser } from '../../../entity/accountUser.entity';
import { CalendarModule } from 'primeng/calendar';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    CalendarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart1') chart1: any;
  @ViewChild('chart2') chart2: any;

  items!: MenuItem[];

  bookings: Booking[] = []
  bookingdetails: BookingDetail[] = []

  countOrder: number = 0
  countRevenue: number = 0
  countuser: number = 0

  revenueDifference: number
  ticketDifference: number

  fromDate1: any
  toDate1: any
  fromDate2: any
  toDate2: any

  chartData1: any;
  chartData2: any;

  chartOptions: any;

  subscription!: Subscription;
  constructor(
    public layoutService: LayoutService,
    private bookingService: BookingService,
    private useraccountService: AccountUserService,
    private router: Router
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe((config) => {
        this.initChart();
      });
  }
  async ngOnInit() {
    const levelId = localStorage.getItem('levelId');
    if(levelId =='2'){
      this.router.navigate(['/admin/checkTicket']);

    }
    await this.bookingService.getAll().then(
      res => {
        this.bookings = res['booking'] as Booking[]
        this.bookings = this.bookings.reverse();
        this.bookingdetails = res['details'] as BookingDetail[]
        this.countOrder = this.bookingdetails.length
        this.bookingdetails.forEach(d => {
          this.countRevenue += d.priceAfterDiscount
        })
      }
    )
    await this.useraccountService.GetAllAccountUserInfo().then(
      res => {
        var users = res as AccountUser[]
        this.countuser = users.length
      }
    )

    const today = new Date();

    // Ngày hiện tại
    this.toDate1 = today;

    // Từ đầu tháng hiện tại
    this.fromDate1 = new Date(today.getFullYear(), today.getMonth(), 1);

    // Từ đầu tháng trước
    this.fromDate2 = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Đến cuối tháng trước
    this.toDate2 = new Date(today.getFullYear(), today.getMonth(), 0);

    this.initChart();
    this.onDateChange();


    this.items = [
      { label: 'Add New', icon: 'pi pi-fw pi-plus' },
      { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    ];
  }
  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData1 = {
      labels: ['Revenue'],
      datasets: [
        {
          label: 'First Dataset',
          data: [0],  // Ban đầu chưa có dữ liệu
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
          borderColor: documentStyle.getPropertyValue('--bluegray-700'),
          tension: .4
        }
      ]
    };
    this.chartData2 = {
      labels: ['Revenue'],
      datasets: [
        {
          label: 'Second Dataset',
          data: [0],  // Ban đầu chưa có dữ liệu
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--green-600'),
          borderColor: documentStyle.getPropertyValue('--green-600'),
          tension: .4
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
}

  onDateChange() {
    const fromDate1 = this.fromDate1;
    const toDate1 = this.toDate1;
    const fromDate2 = this.fromDate2;
    const toDate2 = this.toDate2;
    

    const firstDatasetBookings = this.bookings.filter(booking => {
        const bookingDate = this.getDateWithoutTime(booking.bookingDate);
        // console.log(bookingDate);
        // console.log(booking.bookingDate);
        
        
        return bookingDate >= fromDate1 && bookingDate <= toDate1;
    });
    // console.log(firstDatasetBookings);
    

    const secondDatasetBookings = this.bookings.filter(booking => {
        const bookingDate = this.getDateWithoutTime(booking.bookingDate);
        return bookingDate >= fromDate2 && bookingDate <= toDate2;
    });

    // Lấy danh sách bookingId từ các booking đã lọc
    const firstDatasetBookingIds = firstDatasetBookings.map(booking => booking.bookingId);
    const secondDatasetBookingIds = secondDatasetBookings.map(booking => booking.bookingId);

    // Lọc dữ liệu cho First Dataset từ danh sách bookingdetails
    const firstDatasetDetails = this.bookingdetails.filter(detail => {
        return firstDatasetBookingIds.includes(detail.bookingId);
    });

    // Lọc dữ liệu cho Second Dataset từ danh sách bookingdetails
    const secondDatasetDetails = this.bookingdetails.filter(detail => {
        return secondDatasetBookingIds.includes(detail.bookingId);
    });

    // Tính tổng doanh thu
    const firstDatasetRevenue = firstDatasetDetails.reduce((sum, detail) => sum + (detail.priceAfterDiscount || 0), 0);
    const secondDatasetRevenue = secondDatasetDetails.reduce((sum, detail) => sum + (detail.priceAfterDiscount || 0), 0);
   
      this.revenueDifference =parseInt(( firstDatasetRevenue - secondDatasetRevenue).toFixed(1))
    

    const firstDatasetTicket = firstDatasetDetails.length;
    const secondDatasetTicket = secondDatasetDetails.length;
    if(firstDatasetTicket > secondDatasetTicket){

    }
    this.ticketDifference = (firstDatasetTicket - secondDatasetTicket)

    const firstDataset = firstDatasetBookings.map(b=>b.total);
    const secondDateset = secondDatasetBookings.map(b=>b.total);

    const firstLable = firstDatasetBookings.map(b=>this.extractDate(b.bookingDate));
    const secondLable = secondDatasetBookings.map(b=>this.extractDate(b.bookingDate));
    

   
    // Cập nhật dữ liệu biểu đồ
   
    this.updateChart1(firstDataset);
    this.updateChart2(secondDateset);
    
    // console.log(uniqueLabels);
    // console.log(combinedLabels);
    
    this.chartData1.labels=[]
    this.chartData2.labels=[]
    this.chartData1.labels = firstLable;
    this.chartData2.labels = secondLable;
}
extractDate(bookingDate: string): string {
  
  const datePart = bookingDate.split(' ')[1].split('/'); 
  return datePart[0]+'/'+datePart[1]; // Trả về dd/MM
}

getDateWithoutTime(dateStr: string): Date {
    const dateParts = dateStr.split(' ')[1].split('/');
    return new Date(parseInt(dateParts[2], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0], 10));
}


  updateChart1(firstDatasetRevenue: number[]) {
    this.chartData1.datasets[0].data = firstDatasetRevenue;  
 

    // Cập nhật biểu đồ
    if(this.chart1){

      this.chart1.refresh();
    }
  }
    updateChart2(secondDatasetRevenue: number[]) {
      this.chartData2.datasets[0].data = secondDatasetRevenue;  
        
      // Cập nhật biểu đồ
      if(this.chart2){
  
        
        this.chart2.refresh();
      }
}


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }
}
