import * as http from "http"
import country from "./country.json"
import * as fs from "fs"

const port :number = 8000

let UserLock = () => {
 let UserId = "ABCDEFGHIJKLMNOPXYZabcdefghijklmnopxyz0987654321"
 let Value = "VERA"
 for(let i = 0; i < 8; i++)
 {
    Value+=UserId.charAt(Math.floor(Math.random()* UserId.length))
 }
 return Value

}

const server =  http.createServer((req:any, res:any)=> {
    const{method, url} = req
    if(method === "POST" && url === "/country")
    {
      let body = ""
      req.on("data", (chunk:any)=> {
        body += chunk
      })
      req.on("end", ()=> {
        let RecievedData = JSON.parse(body)
        RecievedData.id = UserLock()
        country.push(RecievedData)
        fs.writeFile("./country.json", JSON.stringify(country, null, 2),(err:any )=> {
            if(err)
            {
                res.setHeader("content-type", "application/jason")
                res.writeHead(500)
                res.write(JSON.stringify({
                    message:"error in writing json"
                }))
                res.end()
            }else
            {
                res.setHeader("Content-Type", "application.json")
                res.writeHead(201)
                res.write(JSON.stringify({
                    message:"submitted successfully",
                    result:RecievedData,
        
                }))
                res.end()
            }
        })
       
        res.end()
      })
    }else if(method === "GET" && url === "/allcountry")
    {
      res.setHeader("content-type", "application/json")
      res.writeHead(200)
      res.write(JSON.stringify({
        success:1,
        message:"all country",
        result:country
      }))
      res.end()
    }else if(method === "GET" && url.startsWith("/single/"))
    {
     let getUser = url.split("/")[2]
     let userIden = country.find((items:any)=> items.id === getUser)
     if(userIden)
     {
        res.setHeader("content-type", "application/json")
        res.writeHead(200)
        res.write(JSON.stringify({
            success:1,
            messsage:"user found",
            result:userIden
        }))
        res.end()
     }else
     {
        res.setHeader("content-type", "application/json")
        res.writeHead(404)
        res.write(JSON.stringify({
            success:0,
            message:"user not found"
        }))
        res.end()
     }
    }else if (method === "DELETE" && url.startsWith("/delete/"))
    {
      let SpecId = url.split("/")[2]
      let deleted = -1
      for(let i =0; i < country.length; i++)
      {
         if(country[i].id === SpecId)
         {
           deleted = i
         }

      }
      if(deleted !== -1)
      {
        let getValue = country.splice(deleted, 1)
        res.setHeader("content-type", "application/json")
        res.writeHead(200)
        res.write(JSON.stringify({
            success:1,
            message:"deleted successful"
        }))
        res.end()
      }else
      {
        res.setHeader("content-type", 'application/json')
        res.writeHead(404)
        res.write(JSON.stringify({
            message:"user not found"
        }))
        res.end()
      }
    }else if(method === "PUT" && url.startsWith("/api/update"))
    {
      let getId = url.split("/")[3]
      let AllData = country.findIndex((item:any)=> item.id === getId)
      if(AllData ! == -1)
      {
        let myBody =""
        req.on("data", (chunk:any)=> {
            myBody+= chunk
        })
        req.on("end", ()=> {
            let DataParse = JSON.parse(myBody)
            country[AllData] = {
                ...country[AllData],
                ...DataParse
            }
            fs.writeFile("./country.json", JSON.stringify(country, null, 2),(err:any)=> {
                if(err)
                {
                    res.setHeader("content-type", "application/json")
                    res.writeHead(500)
                    res.write(JSON.stringify({
                        message:"errpr in appending file"
                    }))
                    res.end()
                }else
                {
                    res.setHeader("content-type", "application/json")
                    res.writeHead(200)
                    res.write(JSON.stringify({
                        success:1,
                        message:"updated successfully",
                        result:country[AllData]
                    }))
                }
            })

           
            
            res.end()
        })

      }else
      {
        res.setHeader("content-type", "appication/type")
        res.writeHead(404)
        res.write(JSON.stringify({
            message:"no user found"
        }))
        res.end()
      }
    }
})
server.on("connection", ()=> {
    console.log("server enabled")
})
server.listen(port, ()=> {
    console.log(`listening on port ${port}`)
})