import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Product } from '../model/product.model';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { TokenStorageService } from '../service/token-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../service/cart.service';
import { roleName } from '../model/role.model';
import { Paging } from '../model/page.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private token: TokenStorageService,
    private toastr: ToastrService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    //API call to get array of products

    if (this.token.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.token.getUser().roles;

      if (
        (this.roles?.includes(roleName.a) && this.token.getUser().enabled) ||
        (this.roles?.includes(roleName.mo) && this.token.getUser().enabled) ||
        (this.roles?.includes(roleName.ma) && this.token.getUser().enabled)
      ) {
        this.notUser = true;
        this.productForm = this.fb.group({
          name: [
            '',
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(25),
            ],
          ],
          img: [''],
          category: ['', [Validators.required]],
          description: [''],
          price: [null, [Validators.required, Validators.min(0)]],
          qty: [null, [Validators.required]],
          editBy: [
            this.token.getUser().roles[0].substring(5, 14) +
              ' ' +
              this.token.getUser().username,
          ],
          date: [new Date()],
        });
        this.productService.listproducts().subscribe((res) => {
          this.totalItems = res.data.data.length;
          this.listproducts = res.data.data;
          this.outStock = res.data.data.filter((x: any) => x.qty == 0);
          this.lowquantity = res.data.data.filter(
            (x: any) => x.qty > 0 && x.qty <= 5
          );
          this.productlist = [
            {
              id: 1,
              name: 'Low stock( Quantity < 5): ',
              list: this.lowquantity,
              visible: false,
            },
            {
              id: 2,
              name: 'Out of Stock: ',
              list: this.outStock,
              visible: false,
            },
          ];
        });
      }
      if (!this.token.getUser().enabled) {
        this.userNotActivated = true;
        this.toastr.error('Your account is not activated yet');
      }
    }
    this.getProducts();
  }

  username: string = '';
  productName = '';
  productForm!: FormGroup;
  totalItems: any;
  products: Product[] = [];
  lowquantity: Product[] = [];
  listproducts: Product[] = [];
  outStock: Product[] = [];
  productlist: any[] = [];
  selectedProduct?: Product;
  currentUser: any;
  isSubmitted = false;
  width = 'width:100%';
  notUser = false;
  isAdminOrMod = false;
  sortValue: any;
  hasCategory = false;
  HasProducts: boolean = false;
  content?: string;

  show = false;
  isLoggedIn = false;
  showButton = false;
  display = 'none';
  modal = 'margin-left:25px';
  fontsize = '5px';
  page = 1;
  count = 0;
  pageSize = 8;
  name = '';
  category = '';
  keyword: boolean = false;
  roles?: any[] = [];
  outOfStock = false;
  userNotActivated = false;
  sortOptions = [
    {
      id: 1,
      name: 'Sort by ascending price',
      value: 'ascending',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Sort by descending price',
      value: 'descending',
      isSelected: false,
    },
  ];
  categories: any = [
    { name: 'Shoes' },
    { name: 'Cars' },
    { name: 'Health' },
    { name: 'Computers' },
    { name: 'Garden' },
    { name: 'Beauty' },
    { name: 'Home' },
    { name: 'Clothing' },
    { name: 'Sports' },
    { name: 'Grocery' },
    { name: 'Kids' },
    { name: 'Automotive' },
    { name: 'Toys' },
    { name: 'Movies' },
    { name: 'Grocery' },
  ];
  isSearched = false;

  displayItemPerPage(items: number) {
    this.page = 1;
    this.pageSize = items;
    this.searchProducts();
  }
  sortedOptions(item: any) {
    this.sortValue = this.sortOptions.find((x) => x.value == item.value)?.value;
    this.sortOptions.forEach((option) => {
      if (option.id == item.id) option.isSelected = !option.isSelected;
      else {
        option.isSelected = false;
      }
    });
  }

  showDeleteToast(productname: string) {
    this.toastr.info(productname);
  }
  openModal(product: Product) {
    this.display = 'block';
    this.selectedProduct = product;
  }
  onCloseHandled() {
    this.display = 'none';
  }

  showToast(id: number, name: string) {
    this.toastr.info(
      'Product id=' + id + ' ' + name + ' is succesfully added to the inventory'
    );
  }
  submitSuccess(id: number, name: string) {
    this.isSubmitted = false;
    this.productForm.reset();
    this.showToast(id, name);
    setInterval(() => {
      location.reload();
    }, 1000);
  }
  submitProductForm() {
    this.isSubmitted = true;
    if (this.productForm.valid) {
      const data = this.productForm.value;
      return this.productService.addProduct(data).subscribe(
        (res) => {
          this.submitSuccess(res.id, res.name);
        },
        (error) => console.log(error.message)
      );
    } else {
      return this.toastr.error(
        'Failed to add product',
        'Please check the fields again'
      );
    }
  }

  getPage() {
    const page = sessionStorage.getItem(Paging.PAGE_HOME);
    this.page = page ? +page : 1;
    return this.page;
  }
  //http service to get and display the array of products, paging information from API with parameters category and name, page and page sizee
  getProducts(): void {
    const data = {
      productName: '',
      page: this.page - 1,
      pageSize: this.pageSize,
      category: (this.category = ''),
      sort: (this.sortValue = ''),
    };
    this.productService.getProducts(data).subscribe(
      (response) => {
        const { products, totalItems } = response.data.response;
        this.products = products;
        this.count = totalItems;
        this.HasProducts = true;
      },
      () => {
        this.toastr.error('No products could be found');
      }
    );
  }
  searchProducts() {
    this.isSearched = true;
    const data = {
      productName: this.productName,
      page: this.page - 1,
      pageSize: this.pageSize,
      category: this.category,
      sort: this.sortValue,
    };
    this.productService.getProducts(data).subscribe(
      (response) => {
        const { products, totalItems, currentPage } = response.data.response;
        this.products = products;
        this.count = totalItems;
        this.page = currentPage + 1;
        this.HasProducts = true;
      },
      () => {
        this.toastr.error('No products could be found');
      }
    );
  }

  //http service to get and display the array of products with no parameters
  backToResults(): void {
    this.name == null;
    this.productName = '';
    this.isSearched = false;
    this.sortValue = '';
    const data = {
      productName: '',
      page: 0,
      pageSize: this.pageSize,
      category: '',
      sort: this.sortValue,
    };
    this.productService.getProducts(data).subscribe(
      (response) => {
        const { products, totalItems } = response.data.response;
        this.products = products; //array of products
        this.count = totalItems;
      },
      () => {
        this.toastr.error('No products could be found!');
      }
    );
  }

  handlePageChange(event: number): void {
    this.page = event;

    sessionStorage.setItem(Paging.PAGE_HOME, JSON.stringify(event));
    this.searchProducts();
  }
  eventSearch() {
    this.page = 1;
    this.searchProducts();
  }

  delete(id: any): void {
    this.productService.deleteProduct(id).subscribe(
      (res) => {
        const selectedProduct = this.products.find((x) => x.id === id);
        this.products = this.products.filter((x) => x.id != id);
        this.display = 'none';
        this.showDeleteToast(selectedProduct?.name + ' is deleted');
      },
      () => {
        this.toastr.error(
          'You dont have the right or permission to do this action'
        );
        this.display = 'none';
      }
    );
  }
  addProductToCart(id: number) {
    if (this.roles?.includes(roleName.u)) {
      const productId = { id: id };
      this.cartService.addToCart(productId).subscribe(
        (res) => {
          this.toastr.info('Product successfully added to cart');
          this.cartService.updateCartTotal(res.totalItems);
        },
        (error) => {}
      );
    } else {
      this.toastr.error('You need to sign in to use this function');
    }
  }
}
