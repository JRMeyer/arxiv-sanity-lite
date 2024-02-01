'use strict';

const UTag = props => {
    const tag_name = props.tag;
    const turl = "/?rank=tags&tags=" + tag_name;
    return (
        <div class='rel_utag'>
            <a href={turl}>
                {tag_name}
            </a>
        </div>
    )
}

// Function to summarize the paper
const summarizePaper = (paperId) => {
    // Send a POST request to the summarize_paper route with the paper text
    fetch("/summarize_paper/" + paperId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            paper_text: "Replace this with the actual paper text" // Replace with the actual paper text
        })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the summarized text response here
        console.log(data.summarized_text);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

const Paper = props => {
    const p = props.paper;

    // Function to generate text-to-speech for the paper
    const generateTTSForPaper = () => {
        generateTTS(p.id); // Call the generateTTS function with the paper ID
    };

    // Function to handle summarizing the paper
    const summarizePaperForPaper = () => {
        summarizePaper(p.id); // Call the summarizePaper function with the paper ID
    };

    // Function to add a tag to the paper
    const addTagToPaper = () => {
        fetch("/add/" + p.id + "/" + prompt("Tag to add to this paper:"))
            .then(response => console.log(response.text()));
    };

    // Function to subtract a tag from the paper
    const subtractTagFromPaper = () => {
        fetch("/sub/" + p.id + "/" + prompt("Tag to subtract from this paper:"))
            .then(response => console.log(response.text()));
    };

    // Render user tags
    const userTags = p.utags.map((utxt, ix) => <UTag key={ix} tag={utxt} />);

    // Render add/subtract tag controls if user is logged in
    const tagControls = user ? (
        <div className="rel_utags">
            <div className="rel_utag rel_utag_add" onClick={addTagToPaper}>+</div>
            <div className="rel_utag rel_utag_sub" onClick={subtractTagFromPaper}>-</div>
            {userTags}
        </div>
    ) : null;

    // Render thumbnail image if available
    const thumbImg = p.thumb_url === '' ? null : <div className="rel_img"><img src={p.thumb_url} alt="Thumbnail" /></div>;

    return (
        <div className="rel_paper">
            <div className="rel_score">{p.weight.toFixed(2)}</div>
            <div className="rel_title"><a href={'http://arxiv.org/abs/' + p.id}>{p.title}</a></div>
            <div className="rel_authors">{p.authors}</div>
            <div className="rel_time">{p.time}</div>
            <div className="rel_tags">{p.tags}</div>
            {tagControls}
            {thumbImg}
            <div className="rel_abs">{p.summary}</div>
	    <figure>
	      <audio controls src={p.audio_path} type="audio/wav"></audio>
	    </figure>
	    <button onClick={summarizePaperForPaper}>Summarize Paper</button>
            <button onClick={generateTTSForPaper}>Generate TTS</button>
            <div className="rel_more"><a href={"/?rank=pid&pid=" + p.id}>Similar</a></div>
            <div className="rel_inspect"><a href={"/inspect?pid=" + p.id}>Inspect</a></div>
        </div>
    );
};

const PaperList = props => {
    const lst = props.papers;
    const plst = lst.map((jpaper, ix) => <Paper key={ix} paper={jpaper} />);
    return (
        <div>
            <div id="paperList" class="rel_papers">
                {plst}
            </div>
        </div>
    )
}

const Tag = props => {
    const t = props.tag;
    const turl = "/?rank=tags&tags=" + t.name;
    const tag_class = 'rel_utag' + (t.name === 'all' ? ' rel_utag_all' : '');
    return (
        <div class={tag_class}>
            <a href={turl}>
                {t.n} {t.name}
            </a>
        </div>
    )
}

const TagList = props => {
    const lst = props.tags;
    const tlst = lst.map((jtag, ix) => <Tag key={ix} tag={jtag} />);
    const deleter = () => fetch("/del/" + prompt("delete tag name:"))
                          .then(response => console.log(response.text()));
    // show the #wordwrap element if the user clicks inspect
    const show_inspect = () => { document.getElementById("wordwrap").style.display = "block"; };
    const inspect_elt = words.length > 0 ? <div id="inspect_svm" onClick={show_inspect}>inspect</div> : null;
    return (
        <div>
            <div class="rel_tag" onClick={deleter}>-</div>
            <div id="tagList" class="rel_utags">
                {tlst}
            </div>
            {inspect_elt}
        </div>
    )
}

// render papers into #wrap
ReactDOM.render(<PaperList papers={papers} />, document.getElementById('wrap'));

// render tags into #tagwrap, if it exists
let tagwrap_elt = document.getElementById('tagwrap');
if (tagwrap_elt) {
    ReactDOM.render(<TagList tags={tags} />, tagwrap_elt);
}
