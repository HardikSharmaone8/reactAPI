import {useEffect,useState,useNavigate} from 'react'
import {Table,Button,Modal,Input} from 'antd'

const Api = () =>{

    const [dataSource,setDataSource] = useState([]);
    const [filterDataSource,setFilterDataSource] = useState([])
    const [loading,setLoading] = useState(false)
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [responseIndex, setResponseIndex] = useState('')
    const [inputVal,setInputVal] = useState('')


    const columns = [
        {
            title:'Author',
            dataIndex:"author",
        },
        {
            title:'Content',
            dataIndex:"title",
        },
        {
            title:'Published By',
            dataIndex:'source',
            render: (value) =>{
                return <span>{value.name ? value.name : "Unknown"}</span>
            }
        },
        {
            title:'Visit',
            dataIndex:'url',
            render: (value) =>{
                return <Button type="link" href={value}>Click Me</Button>
            }
        },
        {
            title:'Details',
            dataIndex:'index',
            render: (value) =>{
                // console.log('avluesssss',record)
                return <Button onClick={()=>showModal(value)}>View Details</Button>
            }
        }
    ]


//to show modals

    const showModal = (value) =>{
        setIsModalOpen(true)
        setResponseIndex(value)
    }
    const handleOk = () => {
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };



//feching news api
    const  fetchingAPI = async() =>{
        setLoading(true);
        const res = await fetch(`https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=9c399ac2f5454479b886dfecb0f6b816&page=1`)
        const result = await res.json();
        setLoading(false)
        const results = result.articles.map((value,index)=>{
           return Object.assign({...value,'index':index})
        })
        console.log('result',result)
        setDataSource(results)
        setFilterDataSource(results)
    }
    useEffect(()=>{
        fetchingAPI();
    },[])

    return (
        <>
        <div style={{ marginTop:30,marginBottom:30,width:'30%',float:'right',display:'flex' }}>
        <label>Search:</label>
        <Input
           style={{ backgroundColor: 'white'}}
           suffix={<span className='icofont icofont-search' />}
           placeholder='Type to search...'
           value={inputVal}
           onChange={(e) => {
            setInputVal(e.target.value);
            if (e.target.value.length > 0) {
                console.log('event value',e.target.value)
               let datArr = filterDataSource.filter(
                   (val) =>
                          ((val.author || val.author === null) && val.author.toLowerCase().includes(e.target.value.toLowerCase())) ||
                        (val.title && val.title.toLowerCase().includes(e.target.value.toLowerCase())) ||
                        (val.source.name && val.source.name.toLowerCase().includes(e.target.value.toLowerCase()))
                    );
                    setDataSource(datArr)
                  } else {
                    setDataSource(filterDataSource)
                  }
                }}
        />
        </div>
       
       
       {
        inputVal ? 
        <Table loading={loading} dataSource={dataSource} columns={columns} />
        :
        <Table loading={loading} dataSource={dataSource} columns={columns} />
       }
        {responseIndex !== '' ?  
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className='newContainer'>
            <img src={dataSource[responseIndex].urlToImage} alt="image..." height='200' width='480' margin='auto'></img>
            <h3>{dataSource[responseIndex].title}</h3>
            <p>{dataSource[responseIndex].content.slice(0,100)}...<a href={dataSource[responseIndex].url}>click here</a></p>
        </div>
      </Modal> 
      : ''}
       
        </>
    )
}

export default Api;