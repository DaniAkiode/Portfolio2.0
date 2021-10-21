import React, { Component } from 'react';

class Level1 extends Component {

    render() {
        return (
            <div style={{padding: '1rem', border: '1px solid grey', borderRadius: '4px', maxWidth:400, margin: '3rem auto' }}>
                <h1> Vocaburary Game</h1>

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
                        <input
                            name="value"
                            onChange
                            value
                            id="voca"
                            type="text"
                        />

                        <button
                            className
                            type="submit"
                            onClick
                        > 
                            Submit
                        </button>


                    </div>

                </form>
                {/*Timer*/}
                <div style= {{ display: 'flex' , justifyContent: 'space-between' }}>
                    <button>5</button>
                    <button>4</button>
                    <button>3</button>
                    <button>2</button>
                    <button>1</button>
                    <button
                    >
                        Click to Restart
                        </button>
                </div>

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
                        <button>Retry</button>
                        <button>Level2</button>
                    </div>
            </div>
        )

    }
}

export default Level1; 