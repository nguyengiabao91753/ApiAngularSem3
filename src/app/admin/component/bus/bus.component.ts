import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RatingModule } from 'primeng/rating';
import { AgeGroup } from '../../../entity/agegroup.entity';
import { AgeGroupService } from '../../../service/agegroup.service';
import { BusType } from '../../../entity/bustype.entity';
import { BusTypeService } from '../../../service/bustype.service';
import { Bus } from '../../../entity/bus.entity';
import { BusService } from '../../../service/bus.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ActivatedRoute } from '@angular/router';
import { BusSeat } from '../../../entity/busseat.entity';
import { BusSeatService } from '../../../service/busseat.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-bustype',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    RatingModule,
    MultiSelectModule,
    CheckboxModule,
  ],
  templateUrl: './bus.component.html',
  styleUrl: './bus.component.css'
})
export class BusComponent implements OnInit {

  visible: boolean = false;

  seatOptions = [
    { label: '20 Seats', value: 20 },
    { label: '28 Seats', value: 28 },
    { label: '32 Seats', value: 32 },
    { label: '40 Seats', value: 40 }
  ];


  busSeat: BusSeat = {}
  busSeats: BusSeat[] = []

  bus: Bus = {}
  buses: Bus[] = []

  busType: BusType = {}
  busTypes: BusType[] = []

  formGroup!: FormGroup

  //For notications
  busDialog: boolean = false
  deleteBusDialog: boolean = false
  deleteBusesDialog: boolean = false

  //For multi selected
  selectedBuses: Bus[] = []
  selectedBusTypes: BusType[] = []
  selectedBusSeats: BusSeat[] = []
  //For Table
  submitted: boolean = false;
  columns: any[] = []
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private busService: BusService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private busTypeService: BusTypeService,
    private activatedRoute: ActivatedRoute,
    private busSeatService: BusSeatService
  ) {

  }
  ngOnInit(): void {
    this.busService.getAll().then(
      res => {
        this.buses = res as Bus[];
        console.log(this.buses);
      }
    )

    this.busTypeService.getAll().then(
      res => {
        this.busTypes = res as BusType[];
        console.log(this.busTypes);
      }
    )

    // this.activatedRoute.paramMap.subscribe(p => {
    //   let busId = p.get('busId');

    //   this.busSeatService.getSeatsByBusId(busId).then(
    //     res => {
    //       this.busSeat = res as BusSeat;
    //     },
    //     error => {
    //       console.log('error');
    //     }
    //   )
    // })

    this.formGroup = this.formBuilder.group({
      busId: [0],
      busTypeId: ['', [Validators.required]], // bắt buộc chọn loại xe
      airConditioned: [{ value: '', disabled: true }],
      licensePlate: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)],
      [this.licensePlateExistsValidator.bind(this)]
      ],
      seatCount: ['', [Validators.required, Validators.min(10), Validators.max(60)]], 
      basePrice: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });


    this.formGroup.get('busTypeId')?.valueChanges.subscribe(selectedBusType => {
      selectedBusType = this.busTypes.find(b => b.busTypeId === selectedBusType);
      if (selectedBusType && selectedBusType.name === 'Volvo') {
        this.formGroup.get('airConditioned')?.enable();
      } else {
        this.formGroup.get('airConditioned')?.disable();
        this.formGroup.get('airConditioned')?.setValue('');
      }
    })


    this.cols = [
      { field: 'busId', header: 'Id' },
      { field: 'busName', header: 'Bus Name' },
      { field: 'airConditioned', header: 'Air Condition' },
      { field: 'licensePlate', header: 'License Plate' },
      { field: 'seatCount', header: ' Seat Counts' },
      { field: 'basePrice', header: 'Base Price' },
      { field: 'status', header: 'Status' }
    ];

    this.columns = [
      { field: 'seatId', header: 'Id' },
      { field: 'name', header: 'Name' },
      { field: 'busLicensePlate', header: 'License Plate' },
      { field: 'status', header: 'Status' },
    ]
  }

  licensePlateExistsValidator(control: AbstractControl): Observable<{[key: string]: any} | null> {
    return this.busService.checkLicensePlateExist(control.value).pipe(
      map(
        res => {
          return res.exists ? {licensePlateExists: true} : null;
        }
      )
    )
  }

  showDialog(busId: string) {
    if (!busId) {
      console.log('Bus ID không hợp lệ');
      return;
    }

    this.busSeatService.getSeatsByBusId(busId).then(
      res => {
        this.busSeats = res as BusSeat[];
      },
      error => {
        console.log('error');
      }
    )
    this.visible = true;
  }

  openNew() {
    this.bus = {};
    this.submitted = false;
    this.busDialog = true;
  }

  hideDialog() {
    this.busDialog = false;
    this.submitted = false;
    this.formGroup.reset()
  }

  editBusType(bus: Bus) {
    this.formGroup.patchValue({
      busId: bus.busId,
      busTypeId: bus.busTypeId,
      airConditioned: bus.airConditioned,
      licensePlate: bus.licensePlate,
      seatCount: bus.seatCount,
      basePrice: bus.basePrice
    }),

      this.busDialog = true;
  }

  deleteBus(bus: Bus) {
    this.deleteBusDialog = true;
    this.bus = { ...bus };
  }

  save() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return; 
    }
    if (this.formGroup.get('busId').value == 0) {
      this.bus = this.formGroup.value as Bus
      const selectedBusTypeId = this.formGroup.get('busTypeId')?.value;
      const selectedBusType = this.busTypes.find(busType => busType.busTypeId === selectedBusTypeId);
      if (selectedBusType) {
        this.bus.busTypeId = selectedBusType.busTypeId;
        this.bus.busName = selectedBusType.name;
      } else {
        console.error('Not found');
      }
      this.bus.airConditioned = this.formGroup.get('airConditioned')?.value ? 1 : 0;
      this.bus.licensePlate = this.formGroup.get('licensePlate')?.value.toString();
      this.bus.seatCount = this.formGroup.get('seatCount')?.value.toString();
      this.bus.basePrice = this.formGroup.get('basePrice')?.value.toString();
      this.bus.status = 1;
      console.log('Bus Object:', this.bus);
      this.busService.create(this.bus).then(
        res => {
          if (res['status']) {
            this.busDialog = false;
            this.formGroup.reset();
            this.buses.push(this.bus);
          }
        },
        error => {
          alert('Error');
        }
      )
    } else {
      this.bus = this.formGroup.value as Bus
      const selectedBusTypeId = this.formGroup.get('busTypeId')?.value;
      const selectedBusType = this.busTypes.find(busType => busType.busTypeId === selectedBusTypeId);
      if (selectedBusType) {
        this.bus.busTypeId = selectedBusType.busTypeId;
        this.bus.busName = selectedBusType.name;
      } else {
        console.error('Not found');
      }
      this.bus.airConditioned = this.formGroup.get('airConditioned')?.value ? 1 : 0;
      this.bus.licensePlate = this.formGroup.get('licensePlate')?.value.toString();
      this.bus.seatCount = this.formGroup.get('seatCount')?.value.toString();
      this.bus.basePrice = this.formGroup.get('basePrice')?.value.toString();
      this.bus.status = 1;
      console.log('Bus Object:', this.bus);
      this.busService.update(this.bus).then(
        res => {
          this.busDialog = false;
          this.formGroup.reset();

          this.buses = this.buses.map(b =>
            b.busId === this.bus.busId ? { ...this.bus } : b
          )
        },
        error => {
          alert('Error');
        }
      )
    }
  }

  confirmDelete() {
    this.deleteBusDialog = false;
    this.bus.status = 0;
    console.log('Deleting Bus: ', this.bus);

    this.busService.update(this.bus).then(
      res => {
        if (res['status']) {
          this.buses = this.buses.filter(b => b.busId !== this.bus.busId);
          console.log('Deleted bus: ', this.bus);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bus Deleted', life: 3000 });
          this.bus = {};
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Bus Type', life: 3000 });
      }
    )
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}