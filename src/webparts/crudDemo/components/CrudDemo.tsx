import * as React from 'react';
import styles from './CrudDemo.module.scss';
import { ICrudDemoProps } from './ICrudDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as $ from 'jquery';
import { sp } from "@pnp/sp/presets/all";
import pnp from 'sp-pnp-js';


interface IMyComponentState{
  data:any,
  filler:any,
  Title:string,
  Lastname:string,
  Jobtype:string,
  Role:string,
  ManagerId:string,
  DepartmentId:string,
  presentId:string

}

export default class CrudDemo extends React.Component<ICrudDemoProps, IMyComponentState> {
  endPoint = `https://niroj.sharepoint.com/sites/Test/_api/web/lists/GetByTitle('Employee OnBoard')/items`;
  url=`https://niroj.sharepoint.com/sites/Test/_api/web/lists/GetByTitle('Employee OnBoard')/`
  constructor(props) {
    super(props);
    this.state={
      data : [],
      filler:[],
      Title:'',
    Lastname:'',
    Jobtype:'',
    Role:'',
    ManagerId:'',
    DepartmentId:'',
    presentId:''

    }
  
    this.createItem=this.createItem.bind(this);
    this.DeleteItem=this.DeleteItem.bind(this);
    this.EditItem=this.EditItem.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.EditNew=this.EditNew.bind(this);
  }
  async componentDidMount(){
    console.log("hello");
    sp.setup(this.props.context);
    
    await this.getData();
    
    console.log(this.state.data);
  }
  handleChange=(e)=>
  {
    let change={};
    change[e.target.name]=e.target.value;
    this.setState(change);

  }
  async EditNew()
  {
    console.log('dfcec');
    //'cnscnme'
    var newUrl=this.url+'getItemById('+this.state.presentId+')';
    const request:any={};
   request.headers={
    'X-Http-Method':'MERGE',
    'IF-MATCH':'*'
   }
   request.body=JSON.stringify({
    Title:this.state.Title,
    Lastname:this.state.Lastname,
    Jobtype:this.state.Jobtype,
    DepartmentId:this.state.DepartmentId,
    Role:this.state.Role,
    ManagerId:this.state.ManagerId
   });
   await this.props.context.spHttpClient.post(newUrl,SPHttpClient.configurations.v1,request);
   await this.getData();
   console.log('csc');
   

  }

  async getData():Promise<any>{
    
    
    var res = await this.props.context.spHttpClient
      .get(this.endPoint, SPHttpClient.configurations.v1)
      .then((res: SPHttpClientResponse) => res.json())
      .then((data) => data);
    this.setState({data:res.value});
    return res;
    // let list=await pnp.sp.web.lists.getByTitle("Employee OnBoard").items.get().then((response)=>{
    //   console.log(response);
    //   console.log("Noooo");
    //   console.log("nnn");
      
      
    // });
    // console.log(list);
    
    
  }
  
  async postData(){
    var body = JSON.stringify({
      ID: 1,
      Title: 'x'
    });
    await this.props.context.spHttpClient.post(
      this.endPoint,
      SPHttpClient.configurations.v1,
      {
        body: body,
      }
    );
    await this.getData();
  }
  async DeleteItem(Id){
    
    var newUrl=this.url+'getItemById('+Id+')';

   const request:any={};
   request.headers={
    'X-Http-Method':'DELETE',
    'IF-MATCH':'*'
   }

    await this.props.context.spHttpClient.post(newUrl,SPHttpClient.configurations.v1,request);
    await this.getData();
  }

  async createItem(){
    var body=JSON.stringify({
      Title:this.state.Title,
      Lastname:this.state.Lastname,
      Jobtype:this.state.Jobtype,
      DepartmentId:this.state.DepartmentId,
      Role:this.state.Role,
      ManagerId:this.state.ManagerId
    });
    await this.props.context.spHttpClient.post(this.endPoint,SPHttpClient.configurations.v1,{body:body});
    await this.getData();
  }

  async EditItem(Id)
  {
    console.log(Id);
    console.log(this.state.data);
    
    var x;
    this.state.data.forEach(element => {
      if(element.Id==Id)
      {
        x=element;
      }
    });
  console.log(x);
  this.setState({
    Title:x.Title,
    DepartmentId:x.DepartmentId,
    Lastname:x.Lastname,
    ManagerId:x.ManagerId,
    Role:x.Role,
    Jobtype:x.Jobtype
  });
  this.setState({
    presentId:Id
  })
  

  //   var newUrl=this.url+'getItemById('+Id+')';
  //   const request:any={};
  //  request.headers={
  //   'X-Http-Method':'MERGE',
  //   'IF-MATCH':'*'
  //  }
  //  request.body=JSON.stringify({
  //    Title:'New'
  //  });
  //  await this.props.context.spHttpClient.post(newUrl,SPHttpClient.configurations.v1,request);
  //  await this.getData();
  }
  
  public render(): React.ReactElement<ICrudDemoProps> {
    return (
      <div className={ styles.crudDemo }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to Employee OnBoard!</span>
              
              <table>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Job Type</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Manager</th>
                </tr>
                
                  {this.state.data.map((d:any)=>(
                    <tr>
                      <td onClick={i=>this.EditItem(d.Id)}>{d.Title}</td>
                      <td>{d.Lastname}</td>
                      <td>{d.Jobtype}</td>
                      <td>{d.DepartmentId}</td>
                      <td>{d.Role}</td>
                      <td>{d.ManagerId}</td>
                      <td><button onClick={i=>this.DeleteItem(d.Id)}>DELETE</button></td>
                    </tr>
                  ))}
                  <tr>
                    <td><input type="" name="Title" value={this.state.Title}  onChange={event=>this.handleChange(event)}/></td>
                    <td><input type="" name="Lastname" value={this.state.Lastname} onChange={event=>this.handleChange(event)} /></td>
                    <td><input type="" name="Jobtype" value={this.state.Jobtype} onChange={event=>this.handleChange(event)}/></td>
                    <td><input type="" name="DepartmentId" value={this.state.DepartmentId} onChange={event=>this.handleChange(event)}/></td>
                    <td><input type="" name="Role" value={this.state.Role} onChange={event=>this.handleChange(event)} /></td>
                    <td><input type="" name="ManagerId" value={this.state.ManagerId} onChange={event=>this.handleChange(event)} /></td>
                  </tr>
                
              </table>
              <button onClick={this.createItem}>Create</button>
              <button onClick={this.EditNew}>Edit</button>
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}
