import React, { Component } from 'react';
import { Input, Button, Progress, Divider } from "antd";
import { level1 } from '../datas';
class Level1 extends Component {


    state = {
        value: "",
        timeOut: false,
        round: 0,
        timer: 10,
        randomTense: "",
        wrongAnswer: "",
        wrondAnswers: [],
    }


    componentDidMount() {
        this.randomTense()
        this.startTimeOut()
    }

    startTimeOut = () => {
        this.timeout = setTimeout(() => {
            this.setState({ timeOut: true})
        }, 10000)

        this.interval = setInterval(() => {
            this.setState({ timer: this.state.timer -1})
        }, 1000)
    }

    componentDidMount() {
        clearTimeout(this.timeout)
        clearInterval(this.interval)
    }

    componentDidUpdate() {
        if(this.state.timer === 0) {
            clearInterval(this.interval)
        }
    }

    randomTense = async() => {
        let TenseArray = ['simple', 'past']

        // we need to get one tense between simple and past randomly
        let randomTense = await TenseArray[Math.floor(Math.random() * TenseArray.length)]
        this.setState({randomTense: randomTense})
    }

    render() {
        return (
            <div style={{padding: '1rem', border: '1px solid grey', borderRadius: '4px', maxWidth:400, margin: '3rem auto' }}>
                <h1> Vocaburary Game</h1>

                <Progress percent={25} status="active"/>

                <div style={{display: 'flex', justifyContent: 'space-between' }}>
                    <h2>LEVEL 1</h2>
                    <h2>1/5</h2>
                </div>

                <span style={{ marginBottom: 0, color: 'grey' }}>Infinitive</span>
                <h2>Voca</h2>

                <div style={{ fontSize: '1rem'}}>
                    Answer the voca's <span style={{color: 'red'}}>Past participle</span>
                </div>

                <form style={{ padding: '1rem 0'}}>
                    <div style={{ display: 'flex' }}>
                        <Input
                            name="value"
                            onChange
                            value
                            id="voca"
                            type="text"
                        />

                        <Button
                            className
                            type="submit"
                            onClick
                        > 
                            Submit
                        </Button>


                    </div>

                </form>
                {/*Timer*/}
                <div style= {{ display: 'flex' , justifyContent: 'space-between' }}>
                    <Button>5</Button>
                    <Button>4</Button>
                    <Button>3</Button>
                    <Button>2</Button>
                    <Button>1</Button>
                    <Button
                    >
                        Click to Restart
                        </Button>
                </div>
                <Divider/>
                {/* Results */}
                    <h3>Wrong ! Correct answer: </h3>
                    <div>
                        <li style={{ display: 'block' }}>
                            <p>
                                icon answer
                            </p>

                        </li>
                    </div>

                    <h1>Reviews the wrong answers</h1>

                    <div>
                        <ul>
                            <li>
                                answer
                            </li>
                            <li>
                                answer
                            </li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-evenly'}}>
                        <Button>Retry</Button>
                        <Button>Level2</Button>
                    </div>
            </div>
        )

    }
}

export default Level1; 